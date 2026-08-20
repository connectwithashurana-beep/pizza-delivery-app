from django.db import models


class Ingredient(models.Model):
    """Abstract-like base handled via concrete models below for clarity + FK simplicity."""
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    stock_quantity = models.PositiveIntegerField(default=100)
    is_available = models.BooleanField(default=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class PizzaBase(Ingredient):
    class Meta:
        indexes = [models.Index(fields=["name"])]


class Sauce(Ingredient):
    class Meta:
        indexes = [models.Index(fields=["name"])]


class Cheese(Ingredient):
    class Meta:
        indexes = [models.Index(fields=["name"])]


class Vegetable(Ingredient):
    class Meta:
        indexes = [models.Index(fields=["name"])]


class Pizza(models.Model):
    CATEGORY_CHOICES = (
        ('pizza', 'Pizza'),
        ('burger', 'Burger'),
        ('sides', 'Sides'),
        ('drinks', 'Drinks'),
        ('desserts', 'Desserts'),
    )
    
    name = models.CharField(max_length=150)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='pizza')
    description = models.TextField(blank=True)
    ingredients_text = models.TextField(blank=True, help_text="Comma separated display text")
    image = models.ImageField(upload_to="pizzas/", blank=True, null=True)
    image_url = models.URLField(blank=True, null=True, help_text="External image URL (takes precedence over ImageField)")
    base_price = models.DecimalField(max_digits=8, decimal_places=2)
    discount = models.IntegerField(default=0, help_text="Discount percentage")
    rating = models.FloatField(default=4.5)
    review_count = models.IntegerField(default=0)
    delivery_time = models.CharField(max_length=20, default="25-30 min")
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["name"]), models.Index(fields=["is_available"]), models.Index(fields=["category"])]
        ordering = ['-is_featured', '-rating']

    def __str__(self):
        return self.name


class Rating(models.Model):
    pizza = models.ForeignKey(Pizza, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='pizza_ratings')
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    review_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('pizza', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} rated {self.pizza.name} {self.rating} stars"


class InventoryLog(models.Model):
    ITEM_TYPES = (("base", "Base"), ("sauce", "Sauce"), ("cheese", "Cheese"), ("vegetable", "Vegetable"))
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES)
    item_id = models.PositiveIntegerField()
    change = models.IntegerField()
    reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
