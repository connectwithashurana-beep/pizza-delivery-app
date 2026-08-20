import requests
import json

base_url = 'http://localhost:8000'

# Test all products
print('=== Testing All Products ===')
r = requests.get(f'{base_url}/api/inventory/pizzas/')
print(f'Status: {r.status_code}')
if r.status_code == 200:
    data = r.json()
    products = data.get('results', data)
    print(f'Total products: {len(products)}')
    if products:
        first = products[0]
        print(f'First product: {first.get("name")}, Category: {first.get("category")}, Image: {first.get("image")[:80] if first.get("image") else "None"}')
else:
    print(f'Error: {r.text[:200]}')

# Test category filtering
print('\n=== Testing Pizza Category ===')
r = requests.get(f'{base_url}/api/inventory/pizzas/?category=pizza')
print(f'Status: {r.status_code}')
if r.status_code == 200:
    data = r.json()
    products = data.get('results', data)
    print(f'Pizza count: {len(products)}')
    for p in products:
        print(f'  - {p.get("name")}: {p.get("category")}')

print('\n=== Testing Burger Category ===')
r = requests.get(f'{base_url}/api/inventory/pizzas/?category=burger')
print(f'Status: {r.status_code}')
if r.status_code == 200:
    data = r.json()
    products = data.get('results', data)
    print(f'Burger count: {len(products)}')

print('\n=== Testing Sides Category ===')
r = requests.get(f'{base_url}/api/inventory/pizzas/?category=sides')
print(f'Status: {r.status_code}')
if r.status_code == 200:
    data = r.json()
    products = data.get('results', data)
    print(f'Sides count: {len(products)}')

print('\n=== Testing Search ===')
r = requests.get(f'{base_url}/api/inventory/pizzas/?search=margherita')
print(f'Status: {r.status_code}')
if r.status_code == 200:
    data = r.json()
    products = data.get('results', data)
    print(f'Search results: {len(products)}')
    if products:
        print(f'Found: {products[0].get("name")}')
