from datetime import timedelta
from django.db.models import Sum, Count, F
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from orders.models import Order, OrderItem
from inventory.models import PizzaBase, Sauce, Cheese, Vegetable
from django.conf import settings


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ("admin", "superadmin"))


class SummaryView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        today = timezone.now().date()
        paid_orders = Order.objects.exclude(status="cancelled")

        total_revenue = paid_orders.aggregate(total=Sum("grand_total"))["total"] or 0
        today_revenue = paid_orders.filter(created_at__date=today).aggregate(total=Sum("grand_total"))["total"] or 0

        low_stock = []
        for model, item_type in [(PizzaBase, "base"), (Sauce, "sauce"), (Cheese, "cheese"), (Vegetable, "vegetable")]:
            threshold = settings.LOW_STOCK_THRESHOLDS.get(item_type, 10)
            for item in model.objects.filter(stock_quantity__lt=threshold):
                low_stock.append({"type": item_type, "name": item.name, "quantity": item.stock_quantity})

        return Response({
            "total_revenue": total_revenue,
            "today_revenue": today_revenue,
            "total_orders": Order.objects.count(),
            "pending_orders": Order.objects.filter(status__in=["received", "preparing", "in_kitchen", "ready", "out_for_delivery"]).count(),
            "completed_orders": Order.objects.filter(status="delivered").count(),
            "cancelled_orders": Order.objects.filter(status="cancelled").count(),
            "low_stock_alerts": low_stock,
        })


class AnalyticsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        last_30_days = timezone.now() - timedelta(days=30)

        monthly_orders = (
            Order.objects.filter(created_at__gte=last_30_days)
            .extra(select={"day": "DATE(created_at)"})
            .values("day")
            .annotate(count=Count("id"), revenue=Sum("grand_total"))
            .order_by("day")
        )

        best_selling = (
            OrderItem.objects.filter(pizza__isnull=False)
            .values("pizza__name")
            .annotate(total_sold=Sum("quantity"))
            .order_by("-total_sold")[:5]
        )

        top_customers = (
            Order.objects.values("user__username", "user__email")
            .annotate(total_spent=Sum("grand_total"), order_count=Count("id"))
            .order_by("-total_spent")[:5]
        )

        return Response({
            "monthly_orders": list(monthly_orders),
            "best_selling_pizzas": list(best_selling),
            "top_customers": list(top_customers),
        })
