#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from inventory.models import Pizza

pizzas = Pizza.objects.all()
print(f'Total products: {pizzas.count()}')
print('\nProducts by category:')
for category in ['pizza', 'burger', 'sides', 'drinks', 'desserts']:
    count = pizzas.filter(category=category).count()
    print(f'  {category}: {count}')
print('\nSample products:')
for p in pizzas[:5]:
    print(f'  - {p.name} ({p.category}): rating={p.rating}, reviews={p.review_count}')
