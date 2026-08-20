from django.contrib import admin
from .models import Order, OrderItem, OrderRating

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "grand_total", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__email", "delivery_address")
    inlines = [OrderItemInline]


@admin.register(OrderRating)
class OrderRatingAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('order__id', 'order__user__email')
    readonly_fields = ('created_at',)
