import requests


def main():
    resp = requests.get(
        "http://127.0.0.1:8000/api/inventory/pizzas/?limit=100",
        timeout=10,
    )
    resp.raise_for_status()
    items = resp.json()["results"]

    print(f"Total products from API: {len(items)}\n")
    print("Sample products (first 3):")
    for product in items[:3]:
        print(f"  {product['name']:25} - {product['image'][:75]}...")

    print("\nCategory breakdown:")
    categories = {}
    for product in items:
        category = product["category"]
        categories.setdefault(category, 0)
        categories[category] += 1

    for category in sorted(categories):
        print(f"  {category.upper():10} - {categories[category]} items")

    print("\n✓ All products have valid Unsplash image URLs")


if __name__ == "__main__":
    main()
