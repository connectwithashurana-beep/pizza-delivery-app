from django.core.management.base import BaseCommand
from inventory.models import Pizza


PRODUCT_IMAGES = {
    # =========================
    # PIZZAS
    # =========================
    "Margherita Magic": "/images/products/pizzas/margherita.jpg",
    "Pepperoni Passion": "/images/products/pizzas/pepperoni.jpg",
    "Veggie Paradise": "/images/products/pizzas/veggie.jpg",
    "BBQ Chicken Bonanza": "/images/products/pizzas/bbq-chicken.jpg",
    "Seafood Supreme": "/images/products/pizzas/seafood.jpg",
    "Four Cheese Delight": "/images/products/pizzas/four-cheese.jpg",
    "Meat Lovers": "/images/products/pizzas/meat-lovers.jpg",
    "Spicy Buffalo": "/images/products/pizzas/buffalo.jpg",

    # =========================
    # BURGERS
    # =========================
    "Classic Cheeseburger": "/images/products/burgers/classic-cheeseburger.jpg",
    "Double Bacon Burger": "/images/products/burgers/double-bacon.jpg",
    "Spicy Jalapeno Burger": "/images/products/burgers/jalapeno.jpg",
    "Mushroom Swiss Burger": "/images/products/burgers/mushroom-swiss.jpg",

    # =========================
    # SIDES
    # =========================
    "Crispy French Fries": "/images/products/sides/fries.jpg",
    "Cheesy Garlic Bread": "/images/products/sides/garlic-bread.jpg",
    "Loaded Nachos": "/images/products/sides/nachos.jpg",
    "Mozzarella Sticks": "/images/products/sides/mozzarella-sticks.jpg",
    "Buffalo Wings": "/images/products/sides/buffalo-wings.jpg",

    # =========================
    # DRINKS
    # =========================
    "Coca Cola": "/images/products/drinks/coca-cola.jpg",
    "Sprite Lemonade": "/images/products/drinks/sprite.jpg",
    "Fresh Mango Shake": "/images/products/drinks/mango-shake.jpg",
    "Strawberry Smoothie": "/images/products/drinks/strawberry-smoothie.jpg",
    "Iced Coffee": "/images/products/drinks/iced-coffee.jpg",

    # =========================
    # DESSERTS
    # =========================
    "Chocolate Lava Cake": "/images/products/desserts/lava-cake.jpg",
    "Cheesecake Delight": "/images/products/desserts/cheesecake.jpg",
    "Brownie Sundae": "/images/products/desserts/brownie-sundae.jpg",
    "Tiramisu Cup": "/images/products/desserts/tiramisu.jpg",
    "Gulab Jamun Dessert": "/images/products/desserts/gulab-jamun.jpg",
}


class Command(BaseCommand):
    help = "Update existing pizza products with local frontend image paths"

    def handle(self, *args, **options):
        updated = 0
        missing = 0

        self.stdout.write("\nUpdating product images...\n")

        for product_name, image_path in PRODUCT_IMAGES.items():

            product = Pizza.objects.filter(name=product_name).first()

            if product:
                product.image_url = image_path
                product.save(update_fields=["image_url"])

                updated += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f"✓ {product_name} -> {image_path}"
                    )
                )

            else:
                missing += 1

                self.stdout.write(
                    self.style.WARNING(
                        f"✗ NOT FOUND: {product_name}"
                    )
                )

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(f"Updated products: {updated}")
        self.stdout.write(f"Missing products: {missing}")
        self.stdout.write("=" * 60 + "\n")

        if updated == 27 and missing == 0:
            self.stdout.write(
                self.style.SUCCESS(
                    "SUCCESS: All 27 product images were updated."
                )
            )