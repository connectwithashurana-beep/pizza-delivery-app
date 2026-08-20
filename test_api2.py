import requests

r = requests.get('http://localhost:8000/api/inventory/pizzas/')
data = r.json()
print(f'Results: {len(data.get("results", []))}')
print(f'Next: {data.get("next")}')
print(f'Count: {data.get("count")}')
print()

if data.get('results'):
    first = data['results'][0]
    print(f'First item: {first.get("name")}')
    print(f'Image URL: {first.get("image")}')
    print(f'Category: {first.get("category")}')
    print(f'Rating: {first.get("rating")}')
    print(f'Review count: {first.get("review_count")}')

print("\n=== All pizzas by category ===")
r = requests.get('http://localhost:8000/api/inventory/pizzas/?category=pizza&limit=100')
data = r.json()
results = data.get('results', data) if isinstance(data, dict) else data
for item in results:
    print(f'{item.get("name")}: {item.get("image")[:100] if item.get("image") else "No image"}')
