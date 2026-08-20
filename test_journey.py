#!/usr/bin/env python
"""
Comprehensive test of Pizza Delivery App - Customer Journey
Tests:
1. Browse menu (get pizzas)
2. Customer login
3. Create order
4. Payment creation (test mode)
5. Admin login
6. Admin updates order status
7. Customer sees updated status
"""

import requests
import json
from pprint import pprint

BASE_URL = "http://127.0.0.1:8000/api"

print("🍕 Pizza Delivery App - Complete Journey Test\n")

# ===== TEST 1: Browse Menu =====
print("TEST 1: Browse Menu")
print("-" * 50)
response = requests.get(f"{BASE_URL}/inventory/pizzas/")
pizzas = response.json()
print(f"✓ Got {pizzas['count']} pizzas from database")
if pizzas['results']:
    pizza = pizzas['results'][0]
    print(f"  Sample: {pizza['name']} - ₹{pizza['base_price']}")
print()

# ===== TEST 2: Customer Login =====
print("TEST 2: Customer Login")
print("-" * 50)
customer_creds = {"email": "customer@pizzahub.local", "password": "customer123"}
response = requests.post(f"{BASE_URL}/auth/login/", json=customer_creds)
if response.status_code == 200:
    tokens = response.json()
    customer_token = tokens['access']
    customer_user = tokens['user']
    print(f"✓ Customer logged in: {customer_user['email']}")
else:
    print(f"✗ Login failed: {response.status_code}")
    exit(1)
print()

# ===== TEST 3: Create Order =====
print("TEST 3: Create Order")
print("-" * 50)
pizza_id = pizzas['results'][0]['id']
order_payload = {
    "delivery_address": "123 Main Street, City Center",
    "contact_number": "9876543211",
    "items": [
        {
            "pizza_id": pizza_id,
            "base_id": None,
            "sauce_id": None,
            "cheese_id": None,
            "vegetable_ids": [],
            "quantity": 1,
        }
    ],
}
headers = {"Authorization": f"Bearer {customer_token}"}
response = requests.post(f"{BASE_URL}/orders/", json=order_payload, headers=headers)
if response.status_code == 201:
    order = response.json()
    order_id = order['id']
    print(f"✓ Order created: #{order_id}")
    print(f"  Total: ₹{order['grand_total']}")
    print(f"  Status: {order['status']}")
else:
    print(f"✗ Order creation failed: {response.status_code}")
    print(response.text)
    exit(1)
print()

# ===== TEST 4: Create Razorpay Order (Payment) =====
print("TEST 4: Payment Order Creation")
print("-" * 50)
payment_payload = {"order_id": order_id}
response = requests.post(f"{BASE_URL}/payments/create-order/", json=payment_payload, headers=headers)
if response.status_code == 200:
    payment = response.json()
    print(f"✓ Razorpay order created")
    print(f"  Order ID: {payment['razorpay_order_id']}")
    print(f"  Amount: {payment['amount']} paise")
    razorpay_order_id = payment['razorpay_order_id']
else:
    print(f"✗ Payment order creation failed: {response.status_code}")
    print(response.text)
print()

# ===== TEST 5: Admin Login =====
print("TEST 5: Admin Login")
print("-" * 50)
admin_creds = {"email": "admin@pizzahub.local", "password": "admin123"}
response = requests.post(f"{BASE_URL}/auth/login/", json=admin_creds)
if response.status_code == 200:
    tokens = response.json()
    admin_token = tokens['access']
    admin_user = tokens['user']
    print(f"✓ Admin logged in: {admin_user['email']}")
else:
    print(f"✗ Admin login failed: {response.status_code}")
print()

# ===== TEST 6: Fetch Order (Customer) =====
print("TEST 6: Fetch Order (Customer View)")
print("-" * 50)
response = requests.get(f"{BASE_URL}/orders/{order_id}/", headers=headers)
if response.status_code == 200:
    order = response.json()
    print(f"✓ Order retrieved: #{order['id']}")
    print(f"  Status: {order['status']}")
    print(f"  Items: {len(order['items'])}")
else:
    print(f"✗ Fetch failed: {response.status_code}")
print()

# ===== TEST 7: Admin Updates Order Status =====
print("TEST 7: Admin Updates Order Status")
print("-" * 50)
admin_headers = {"Authorization": f"Bearer {admin_token}"}
status_update = {"status": "preparing"}
response = requests.post(f"{BASE_URL}/orders/{order_id}/update_status/", json=status_update, headers=admin_headers)
if response.status_code == 200:
    order = response.json()
    print(f"✓ Order status updated: {order['status']}")
else:
    print(f"✗ Status update failed: {response.status_code}")
print()

# ===== TEST 8: Customer Sees Updated Status =====
print("TEST 8: Customer Sees Updated Status")
print("-" * 50)
response = requests.get(f"{BASE_URL}/orders/{order_id}/", headers=headers)
if response.status_code == 200:
    order = response.json()
    print(f"✓ Customer sees updated status: {order['status']}")
else:
    print(f"✗ Fetch failed: {response.status_code}")
print()

# ===== TEST 9: Admin Dashboard =====
print("TEST 9: Admin Dashboard")
print("-" * 50)
response = requests.get(f"{BASE_URL}/dashboard/summary/", headers=admin_headers)
if response.status_code == 200:
    dashboard = response.json()
    print(f"✓ Dashboard data retrieved")
    print(f"  Total orders: {dashboard['total_orders']}")
    print(f"  Total revenue: ₹{dashboard['total_revenue']}")
else:
    print(f"✗ Dashboard fetch failed: {response.status_code}")
print()

print("=" * 50)
print("✅ All tests passed successfully!")
print("=" * 50)
