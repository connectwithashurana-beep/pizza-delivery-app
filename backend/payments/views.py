import razorpay
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import APIException
from orders.models import Order
from inventory.tasks import reduce_stock
from .models import Payment


class StockUnavailable(APIException):
    status_code = 409
    default_detail = "An ingredient is out of stock. Please contact support."
    default_code = "stock_unavailable"


def get_razorpay_client():
    key_id = settings.RAZORPAY_KEY_ID or ""
    key_secret = settings.RAZORPAY_KEY_SECRET or ""

    if not key_id or not key_secret:
        raise RuntimeError(
            "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env."
        )

    return razorpay.Client(auth=(key_id, key_secret))


class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=404)

        if order.payment_method.lower() != "razorpay":
            return Response({"detail": "This order is not configured for Razorpay."}, status=400)

        existing_payment = Payment.objects.filter(order=order).first()
        if existing_payment and existing_payment.status == "success":
            return Response({"detail": "This order has already been paid for."}, status=400)

        amount_paise = int(round(float(order.grand_total) * 100))

        try:
            client = get_razorpay_client()
            rp_order = client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "payment_capture": 1,
            })
        except RuntimeError as exc:
            return Response({"detail": str(exc)}, status=500)
        except Exception as exc:
            description = getattr(getattr(exc, "error", None), "get", lambda *args, **kwargs: None)("description")
            detail = description or str(exc) or "Unable to initiate payment right now. Please try again."
            return Response({"detail": detail}, status=502)

        Payment.objects.update_or_create(
            order=order,
            defaults={
                "razorpay_order_id": rp_order["id"],
                "amount": order.grand_total,
                "status": "pending",
                "razorpay_payment_id": "",
                "razorpay_signature": "",
            },
        )

        return Response({
            "razorpay_order_id": rp_order["id"],
            "amount": amount_paise,
            "currency": "INR",
            "key": settings.RAZORPAY_KEY_ID,
        })


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_signature = data.get("razorpay_signature")

        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({"detail": "Missing payment details."}, status=400)

        try:
            payment = Payment.objects.select_related("order", "order__user").get(
                razorpay_order_id=razorpay_order_id
            )
        except Payment.DoesNotExist:
            return Response({"detail": "Payment record not found."}, status=404)

        if payment.order.user_id != request.user.id:
            return Response({"detail": "Payment record not found."}, status=404)

        if payment.order.payment_method.lower() != "razorpay":
            return Response({"detail": "This order is not configured for Razorpay."}, status=400)

        if payment.status == "success":
            return Response({"message": "Payment already verified.", "order_id": payment.order_id})

        try:
            client = get_razorpay_client()
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })
        except RuntimeError as exc:
            return Response({"detail": str(exc)}, status=500)
        except razorpay.errors.SignatureVerificationError:
            payment.status = "failed"
            payment.save(update_fields=["status"])
            return Response({"detail": "Payment verification failed."}, status=400)

        try:
            rp_payment = client.payment.fetch(razorpay_payment_id)
            captured_amount_paise = int(rp_payment.get("amount", 0))
            expected_amount_paise = int(round(float(payment.amount) * 100))
            if (
                captured_amount_paise != expected_amount_paise
                or rp_payment.get("currency") != "INR"
                or rp_payment.get("order_id") != razorpay_order_id
                or rp_payment.get("status") != "captured"
            ):
                payment.status = "failed"
                payment.save(update_fields=["status"])
                return Response({"detail": "Payment amount mismatch. Please contact support."}, status=400)
        except Exception:
            return Response({"detail": "Unable to confirm payment right now. Please try again."}, status=502)

        with transaction.atomic():
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            payment.status = "success"
            payment.save()

            order = payment.order
            order.status = "preparing"
            order.save(update_fields=["status"])

            for item in order.items.select_related("base", "sauce", "cheese").prefetch_related("vegetables"):
                if item.base_id:
                    if not reduce_stock("base", item.base_id, item.quantity):
                        raise StockUnavailable()
                if item.sauce_id:
                    if not reduce_stock("sauce", item.sauce_id, item.quantity):
                        raise StockUnavailable()
                if item.cheese_id:
                    if not reduce_stock("cheese", item.cheese_id, item.quantity):
                        raise StockUnavailable()
                for veg in item.vegetables.all():
                    if not reduce_stock("vegetable", veg.id, item.quantity):
                        raise StockUnavailable()

        send_mail(
            "Payment Successful",
            f"Payment for order #{order.id} was successful. Your pizza is being prepared!",
            settings.DEFAULT_FROM_EMAIL, [order.user.email], fail_silently=True,
        )

        return Response({"message": "Payment verified successfully.", "order_id": order.id})
