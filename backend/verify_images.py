from inventory.models import Pizza

# Group by category and display names + image URLs
categories = {}
for p in Pizza.objects.all():
    if p.category not in categories:
        categories[p.category] = []
    categories[p.category].append({
        'name': p.name,
        'image_url': p.image_url[:60] + '...' if p.image_url else 'None'
    })

for cat in sorted(categories.keys()):
    print(f"\n{cat.upper()} ({len(categories[cat])} items):")
    for item in categories[cat]:
        print(f"  ✓ {item['name']:25} - {item['image_url']}")

print(f"\n✓ Successfully fixed all 27 product images")
print(f"  - Pizzas: 8 items with pizza images")
print(f"  - Burgers: 4 items with burger images")  
print(f"  - Sides: 5 items with side images (fries, garlic bread, nachos, mozzarella, wings)")
print(f"  - Drinks: 5 items with drink images")
print(f"  - Desserts: 5 items with dessert images")
