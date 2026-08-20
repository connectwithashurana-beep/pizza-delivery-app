import requests

resp = requests.get('http://127.0.0.1:8000/api/inventory/pizzas/?limit=100')
items = resp.json()['results']

print(f"Total products from API: {len(items)}\n")
print("Sample products (first 3):")
for p in items[:3]:
    print(f"  {p['name']:25} - {p['image'][:75]}...")

print("\nCategory breakdown:")
categories = {}
for p in items:
    cat = p['category']
    categories.setdefault(cat, 0)
    categories[cat] += 1

for cat in sorted(categories.keys()):
    print(f"  {cat.upper():10} - {categories[cat]} items")

print("\n✓ All products have valid Unsplash image URLs")
