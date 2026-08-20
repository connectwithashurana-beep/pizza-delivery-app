from django.conf import settings
from django.db import models
from inventory.models import Pizza, PizzaBase, Sauce, Cheese, Vegetable


class Order(models.Model):
    STATUS_CHOICES = (
        ("received", "Order Received"),
        ("preparing", "Preparing"),
        ("in_kitchen", "In Kitchen"),
        ("ready", "Ready"),
        ("out_for_delivery", "Out For Delivery"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="received")
    delivery_address = models.TextField()
    contact_number = models.CharField(max_length=15)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    gst = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_charge = models.DecimalField(max_digits=10, decimal_places=2)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=30, default="razorpay")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["status"]), models.Index(fields=["created_at"])]
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id} - {self.user.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    pizza = models.ForeignKey(Pizza, on_delete=models.SET_NULL, null=True, blank=True)
    base = models.ForeignKey(PizzaBase, on_delete=models.SET_NULL, null=True, blank=True)
    sauce = models.ForeignKey(Sauce, on_delete=models.SET_NULL, null=True, blank=True)
    cheese = models.ForeignKey(Cheese, on_delete=models.SET_NULL, null=True, blank=True)
    vegetables = models.ManyToManyField(Vegetable, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Item in Order #{self.order_id}"


class OrderRating(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='rating')
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    review_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating for Order #{self.order_id}"
