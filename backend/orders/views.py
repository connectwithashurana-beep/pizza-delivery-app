from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Order, OrderRating
from .serializers import OrderSerializer, CreateOrderSerializer, OrderRatingSerializer
from .utils import broadcast_order_status


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ("admin", "superadmin"))


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    authentication_classes = [JWTAuthentication]
    # Always require login, regardless of DEBUG. The previous
    # `[AllowAny] if DEBUG else [IsAuthenticated]` meant that with the
    # project's default DEBUG=True, *unauthenticated* requests were let
    # through the permission check entirely (get_queryset() then hid data
    # from them, but that's not a substitute for actually denying access).
    permission_classes = [IsAuthenticated]
    # Customers must never be able to PUT/PATCH/DELETE an order directly —
    # OrderSerializer exposes `status` and `grand_total` as writable fields,
    # so an authenticated customer could otherwise mark their own order
    # "delivered" or edit its total via the default ModelViewSet update/
    # destroy actions. Status changes only happen through the explicit
    # `update_status` / `cancel` actions below, which are admin-only.
    http_method_names = ["get", "post", "head", "options"]
    filterset_fields = ["status"]
    search_fields = ["delivery_address", "contact_number"]
    ordering_fields = ["created_at", "grand_total"]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Order.objects.none()
        if getattr(user, "role", None) in ("admin", "superadmin"):
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def get_serializer_class(self):
        if self.action == "create":
            return CreateOrderSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        if not request.data:
            return Response({"detail": "Request body is required."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CreateOrderSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        send_mail(
            "Order Confirmation",
            f"Your order #{order.id} has been received. Grand total: Rs.{order.grand_total}",
            settings.DEFAULT_FROM_EMAIL, [order.user.email], fail_silently=True,
        )
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminRole])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({"detail": "Invalid status."}, status=400)
        order.status = new_status
        order.save()
        broadcast_order_status(order.id, new_status)
        if new_status == "delivered":
            send_mail(
                "Your pizza has been delivered!",
                f"Order #{order.id} has been delivered. Enjoy your meal!",
                settings.DEFAULT_FROM_EMAIL, [order.user.email], fail_silently=True,
            )
        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminRole])
    def cancel(self, request, pk=None):
        order = self.get_object()
        order.status = "cancelled"
        order.save()
        broadcast_order_status(order.id, "cancelled")
        return Response(OrderSerializer(order).data)
    
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def rate(self, request, pk=None):
        """Rate an order (only available after delivery)"""
        order = self.get_object()
        
        # Verify the user owns the order
        if order.user != request.user:
            return Response(
                {"detail": "You can only rate your own orders."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if order is delivered
        if order.status != "delivered":
            return Response(
                {"detail": "You can only rate orders that have been delivered."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        rating_value = request.data.get('rating')
        review_text = request.data.get('review_text', '')
        
        if not rating_value:
            return Response(
                {"detail": "rating field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            rating_value = int(rating_value)
            if rating_value < 1 or rating_value > 5:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {"detail": "rating must be an integer between 1 and 5."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create or update rating
        rating, created = OrderRating.objects.update_or_create(
            order=order,
            defaults={'rating': rating_value, 'review_text': review_text}
        )
        
        serializer = OrderRatingSerializer(rating)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
