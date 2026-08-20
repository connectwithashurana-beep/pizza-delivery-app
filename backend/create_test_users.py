#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import User

# Create admin user
admin, created = User.objects.get_or_create(
    email='admin@pizzahub.local',
    defaults={
        'username': 'admin',
        'first_name': 'Admin',
        'last_name': 'User',
        'phone': '9876543210',
        'role': 'admin',
        'is_staff': True,
        'is_superuser': False,
        'is_email_verified': True,
    }
)
if created:
    admin.set_password('admin123')
    admin.save()
    print(f"✓ Created admin: {admin.email}")
else:
    print(f"✓ Admin already exists: {admin.email}")

# Create test customer
customer, created = User.objects.get_or_create(
    email='customer@pizzahub.local',
    defaults={
        'username': 'customer',
        'first_name': 'John',
        'last_name': 'Doe',
        'phone': '9876543211',
        'address': '123 Main Street, City Center',
        'role': 'customer',
        'is_email_verified': True,
    }
)
if created:
    customer.set_password('customer123')
    customer.save()
    print(f"✓ Created customer: {customer.email}")
else:
    print(f"✓ Customer already exists: {customer.email}")

print("✅ Test users created successfully!")
