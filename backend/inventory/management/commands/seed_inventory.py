from django.core.management.base import BaseCommand
from inventory.models import PizzaBase, Sauce, Cheese, Vegetable, Pizza


class Command(BaseCommand):
    help = "Seed basic pizza inventory data for development"

    def handle(self, *args, **options):
        created = []

        bases = [
            ("Thin Crust", 180.00),
            ("Hand Tossed", 220.00),
            ("Stuffed Crust", 260.00),
        ]
        for name, price in bases:
            obj, _ = PizzaBase.objects.get_or_create(name=name, defaults={"price": price})
            created.append(obj)

        sauces = [
            ("Marinara", 40.00),
            ("BBQ", 50.00),
            ("Pesto", 60.00),
        ]
        for name, price in sauces:
            obj, _ = Sauce.objects.get_or_create(name=name, defaults={"price": price})
            created.append(obj)

        cheeses = [
            ("Mozzarella", 55.00),
            ("Cheddar", 65.00),
            ("Paneer", 70.00),
        ]
        for name, price in cheeses:
            obj, _ = Cheese.objects.get_or_create(name=name, defaults={"price": price})
            created.append(obj)

        vegetables = [
            ("Onion", 20.00),
            ("Capsicum", 25.00),
            ("Olives", 30.00),
            ("Mushroom", 35.00),
        ]
        for name, price in vegetables:
            obj, _ = Vegetable.objects.get_or_create(name=name, defaults={"price": price})
            created.append(obj)

        pizzas = [
            ("Margherita", "Classic cheese pizza", "Thin Crust", 300.00),
            ("Pepperoni", "Pepperoni delight", "Hand Tossed", 360.00),
            ("Veggie Blast", "Loaded with vegetables", "Stuffed Crust", 390.00),
        ]
        for name, description, base_name, price in pizzas:
            base = PizzaBase.objects.filter(name=base_name).first()
            if base:
                Pizza.objects.get_or_create(
                    name=name,
                    defaults={"description": description, "base_price": price, "ingredients_text": base_name},
                )

        self.stdout.write(self.style.SUCCESS("Seeded pizza inventory data"))
