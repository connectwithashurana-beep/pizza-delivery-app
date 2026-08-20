import requests

base_url = 'http://localhost:8000'

# Test all products
print('=== Testing API with updated image_url ===')
r = requests.get(f'{base_url}/api/inventory/pizzas/?limit=100')
data = r.json()
print(f'Total products: {data.get("count")}')

if data.get('results'):
    first = data['results'][0]
    print(f'\nFirst product: {first.get("name")}')
    print(f'Image URL: {first.get("image")}')
    print(f'Category: {first.get("category")}')
    print(f'Rating: {first.get("rating")}')

print('\n=== Pizza images ===')
r = requests.get(f'{base_url}/api/inventory/pizzas/?category=pizza&limit=100')
data = r.json()
for item in data.get('results', [])[:3]:
    print(f'{item.get("name")}: {item.get("image")[:60]}...')

print('\n=== Burger images ===')
r = requests.get(f'{base_url}/api/inventory/pizzas/?category=burger&limit=100')
data = r.json()
for item in data.get('results', [])[:2]:
    print(f'{item.get("name")}: {item.get("image")[:60]}...')
