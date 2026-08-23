from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from .models import PizzaBase, Sauce, Cheese, Vegetable

MODEL_MAP = {
    "base": PizzaBase,
    "sauce": Sauce,
    "cheese": Cheese,
    "vegetable": Vegetable,
}


@shared_task
def check_low_stock():
    thresholds = settings.LOW_STOCK_THRESHOLDS
    low_items = []
    for item_type, model in MODEL_MAP.items():
        threshold = thresholds.get(item_type, 10)
        for item in model.objects.filter(stock_quantity__lt=threshold):
            low_items.append(f"{item_type.upper()}: {item.name} (qty: {item.stock_quantity})")

    if low_items:
        send_mail(
            "Low Stock Alert - Pizza Delivery",
            "The following items are low on stock:\n\n" + "\n".join(low_items),
            settings.DEFAULT_FROM_EMAIL,
            [settings.ADMIN_EMAIL],
            fail_silently=True,
        )
    return len(low_items)


def reduce_stock(item_type, item_id, quantity=1):
    """Atomically decrement stock at the database level.

    The previous implementation read stock_quantity in Python, computed
    new_qty, then wrote it back — a classic read-then-write race condition.
    Two payments verifying concurrently for the same ingredient could both
    read the same starting quantity and one decrement would be lost,
    silently overselling stock. Using an F() expression makes the
    decrement happen atomically inside the database.
    """
    from django.db.models import F
    from django.db.models.functions import Greatest

    model = MODEL_MAP.get(item_type)
    if not model:
        return False
    updated = model.objects.filter(
        id=item_id,
        is_available=True,
        stock_quantity__gte=quantity,
    ).update(stock_quantity=Greatest(F("stock_quantity") - quantity, 0))
    return updated == 1
