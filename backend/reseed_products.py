#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from inventory.models import Pizza

Pizza.objects.all().delete()
print("Deleted all products. Running seed command...")

# Now run the seed command
import subprocess
subprocess.run(['python', 'manage.py', 'seed_products'], cwd=os.getcwd())
