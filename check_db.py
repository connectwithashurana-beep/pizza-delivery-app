import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from inventory.models import Pizza

total = Pizza.objects.count()
print(f"Total products: {total}")

categories = {}
for p in Pizza.objects.all():
    if p.category not in categories:
        categories[p.category] = []
    categories[p.category].append(p.name)

for cat in sorted(categories.keys()):
    print(f"{cat}: {len(categories[cat])} products")

print("\nFirst product image_url:")
first = Pizza.objects.first()
if first:
    print(f"{first.name}: {first.image_url[:60] if first.image_url else 'NO IMAGE'}")

print("\nSample product with image_url:")
sample = Pizza.objects.filter(image_url__isnull=False).first()
if sample:
    print(f"{sample.name} ({sample.category}): {sample.image_url[:60]}...")
else:
    print("No products with image_url found!")
