from django.core.management.base import BaseCommand
from inventory.models import Pizza, PizzaBase, Sauce, Cheese, Vegetable


class Command(BaseCommand):
    help = "Seed realistic pizza delivery app data"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("🍕 Seeding Pizza Delivery Database..."))

        # Create Bases
        bases_data = [
            {"name": "Classic Hand-Tossed", "price": 0},
            {"name": "Thin & Crispy", "price": 20},
            {"name": "Cheese Burst", "price": 80},
            {"name": "Stuffed Crust", "price": 100},
        ]
        bases = {}
        for b in bases_data:
            obj, created = PizzaBase.objects.get_or_create(name=b["name"], defaults={"price": b["price"]})
            bases[b["name"]] = obj
            if created:
                self.stdout.write(f"  ✓ Created base: {b['name']}")

        # Create Sauces
        sauces_data = [
            {"name": "Marinara", "price": 0},
            {"name": "Garlic Parmesan", "price": 20},
            {"name": "White Sauce", "price": 30},
            {"name": "Spicy Tikka", "price": 40},
            {"name": "Pesto", "price": 50},
            {"name": "BBQ", "price": 25},
        ]
        sauces = {}
        for s in sauces_data:
            obj, created = Sauce.objects.get_or_create(name=s["name"], defaults={"price": s["price"]})
            sauces[s["name"]] = obj
            if created:
                self.stdout.write(f"  ✓ Created sauce: {s['name']}")

        # Create Cheeses
        cheeses_data = [
            {"name": "Mozzarella", "price": 0},
            {"name": "Extra Mozzarella", "price": 50},
            {"name": "Feta Cheese", "price": 60},
            {"name": "Cheddar", "price": 40},
            {"name": "Parmesan", "price": 50},
        ]
        cheeses = {}
        for c in cheeses_data:
            obj, created = Cheese.objects.get_or_create(name=c["name"], defaults={"price": c["price"]})
            cheeses[c["name"]] = obj
            if created:
                self.stdout.write(f"  ✓ Created cheese: {c['name']}")

        # Create Vegetables
        vegetables_data = [
            {"name": "Onion", "price": 10}, {"name": "Capsicum", "price": 15},
            {"name": "Mushroom", "price": 20}, {"name": "Corn", "price": 15},
            {"name": "Black Olives", "price": 25}, {"name": "Paneer", "price": 40},
            {"name": "Jalapeno", "price": 15}, {"name": "Tomato", "price": 10},
            {"name": "Broccoli", "price": 20}, {"name": "Spinach", "price": 15},
            {"name": "Pineapple", "price": 30}, {"name": "Baby Corn", "price": 20},
        ]
        vegetables = {}
        for v in vegetables_data:
            obj, created = Vegetable.objects.get_or_create(name=v["name"], defaults={"price": v["price"]})
            vegetables[v["name"]] = obj
            if created:
                self.stdout.write(f"  ✓ Created vegetable: {v['name']}")

        # Create Pizzas
        pizzas_data = [
            # Vegetarian Pizzas
            {
                "name": "Margherita Supreme",
                "description": "Fresh mozzarella, basil, tomato sauce, and oregano",
                "base_price": 299,
                "ingredients_text": "Tomato sauce, Mozzarella, Fresh basil, Oregano",
                "is_featured": True,
            },
            {
                "name": "Farmhouse",
                "description": "Onion, capsicum, mushroom, corn, and tomato",
                "base_price": 349,
                "ingredients_text": "Onion, Capsicum, Mushroom, Corn, Tomato",
                "is_featured": True,
            },
            {
                "name": "Paneer Tikka",
                "description": "Spiced paneer, onion, capsicum with tikka sauce",
                "base_price": 399,
                "ingredients_text": "Paneer, Onion, Capsicum, Tikka sauce",
                "is_featured": False,
            },
            {
                "name": "Veggie Blast",
                "description": "Loaded with vegetables - onion, capsicum, mushroom, corn, black olives",
                "base_price": 379,
                "ingredients_text": "Onion, Capsicum, Mushroom, Corn, Black olives",
                "is_featured": False,
            },
            {
                "name": "Spinach & Corn",
                "description": "Fresh spinach, sweet corn, and mozzarella cheese",
                "base_price": 319,
                "ingredients_text": "Spinach, Corn, Mozzarella",
                "is_featured": False,
            },
            # Non-Vegetarian Pizzas
            {
                "name": "Pepperoni Paradise",
                "description": "Loaded with pepperoni and extra mozzarella cheese",
                "base_price": 429,
                "ingredients_text": "Pepperoni, Mozzarella, Tomato sauce",
                "is_featured": True,
            },
            {
                "name": "Chicken Tikka",
                "description": "Tender chicken tikka, onion, capsicum with spicy tikka sauce",
                "base_price": 449,
                "ingredients_text": "Chicken tikka, Onion, Capsicum, Tikka sauce",
                "is_featured": True,
            },
            {
                "name": "Tandoori Chicken",
                "description": "Smoky tandoori chicken, onion, capsicum, and cilantro",
                "base_price": 459,
                "ingredients_text": "Tandoori chicken, Onion, Capsicum, Cilantro",
                "is_featured": False,
            },
            {
                "name": "Meat Lovers",
                "description": "Pepperoni, sausage, ham, and bacon on a thin crust",
                "base_price": 499,
                "ingredients_text": "Pepperoni, Sausage, Ham, Bacon",
                "is_featured": False,
            },
            {
                "name": "Chicken Supreme",
                "description": "Chicken, mushroom, onion, capsicum, and cheese",
                "base_price": 419,
                "ingredients_text": "Chicken, Mushroom, Onion, Capsicum",
                "is_featured": False,
            },
            # Premium Pizzas
            {
                "name": "Cheese Burst Deluxe",
                "description": "Double mozzarella, parmesan, extra cheese crust",
                "base_price": 499,
                "ingredients_text": "Extra Mozzarella, Parmesan, Mozzarella crust",
                "is_featured": True,
            },
            {
                "name": "BBQ Chicken",
                "description": "Smoky BBQ chicken, onion, capsicum, and cilantro",
                "base_price": 469,
                "ingredients_text": "BBQ chicken, Onion, Capsicum, Cilantro",
                "is_featured": False,
            },
            {
                "name": "Garlic Parmesan Veggie",
                "description": "Fresh vegetables with garlic parmesan sauce and herbs",
                "base_price": 389,
                "ingredients_text": "Mushroom, Corn, Onion, Garlic, Parmesan",
                "is_featured": False,
            },
            {
                "name": "Pesto Delight",
                "description": "Fresh basil pesto, tomato, mozzarella, and spinach",
                "base_price": 379,
                "ingredients_text": "Pesto sauce, Tomato, Mozzarella, Spinach",
                "is_featured": False,
            },
            {
                "name": "Hawaiian Crunch",
                "description": "Pineapple, ham, corn, and capsicum on a crispy thin crust",
                "base_price": 389,
                "ingredients_text": "Pineapple, Ham, Corn, Capsicum",
                "is_featured": False,
            },
            {
                "name": "Spicy Paneer Delight",
                "description": "Spiced paneer, capsicum, onion, and jalapeno",
                "base_price": 409,
                "ingredients_text": "Paneer, Capsicum, Onion, Jalapeno",
                "is_featured": False,
            },
            # Budget Pizzas
            {
                "name": "Simple Veggie",
                "description": "Classic tomato sauce, mozzarella, and fresh vegetables",
                "base_price": 249,
                "ingredients_text": "Tomato sauce, Mozzarella, Onion, Tomato",
                "is_featured": False,
            },
            {
                "name": "Onion & Tomato",
                "description": "Simple, fresh, and delicious - classic combination",
                "base_price": 219,
                "ingredients_text": "Tomato sauce, Mozzarella, Onion, Tomato",
                "is_featured": False,
            },
            {
                "name": "Chicken & Corn",
                "description": "Succulent chicken pieces and sweet corn",
                "base_price": 349,
                "ingredients_text": "Chicken, Corn, Mozzarella",
                "is_featured": False,
            },
            {
                "name": "Spicy Veggie Mix",
                "description": "Onion, capsicum, jalapeno, and corn with spicy sauce",
                "base_price": 319,
                "ingredients_text": "Onion, Capsicum, Jalapeno, Corn",
                "is_featured": False,
            },
        ]

        for p in pizzas_data:
            obj, created = Pizza.objects.get_or_create(name=p["name"], defaults={**p, "is_available": True})
            if created:
                self.stdout.write(f"  ✓ Created pizza: {p['name']} - ₹{p['base_price']}")

        self.stdout.write(self.style.SUCCESS("✅ Database seeding complete!"))
        self.stdout.write(self.style.SUCCESS(f"✅ Total pizzas: {Pizza.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"✅ Total bases: {PizzaBase.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"✅ Total sauces: {Sauce.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"✅ Total cheeses: {Cheese.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"✅ Total vegetables: {Vegetable.objects.count()}"))
