import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from orders.models import Order
from accounts.models import User
from inventory.models import Pizza

print("📊 Database Summary:")
print(f"  Total Users: {User.objects.count()}")
print(f"  Admin Users: {User.objects.filter(role='admin').count()}")
print(f"  Customer Users: {User.objects.filter(role='customer').count()}")
print(f"  Total Pizzas: {Pizza.objects.count()}")
print(f"  Total Orders: {Order.objects.count()}")

if Order.objects.exists():
    print("\n📦 Recent Orders:")
    for order in Order.objects.all().order_by('-id')[:3]:
        print(f"  Order #{order.id}: {order.status} - ₹{order.grand_total} ({order.items.count()} items)")
