from django.core.management.base import BaseCommand
from inventory.models import Pizza, PizzaBase, Sauce, Cheese, Vegetable


class Command(BaseCommand):
    help = "Seed database with realistic food products"

    def handle(self, *args, **options):

        # ============================================================
        # CLEAR EXISTING DATA
        # ============================================================

        Pizza.objects.all().delete()
        PizzaBase.objects.all().delete()
        Sauce.objects.all().delete()
        Cheese.objects.all().delete()
        Vegetable.objects.all().delete()

        # ============================================================
        # PIZZA BASES
        # ============================================================

        bases = [
            PizzaBase.objects.create(name="Thin Crust", price=0),
            PizzaBase.objects.create(name="Regular Crust", price=20),
            PizzaBase.objects.create(name="Thick Crust", price=40),
            PizzaBase.objects.create(name="Stuffed Crust", price=60),
        ]

        # ============================================================
        # SAUCES
        # ============================================================

        sauces = [
            Sauce.objects.create(name="Tomato", price=0),
            Sauce.objects.create(name="BBQ", price=10),
            Sauce.objects.create(name="Pesto", price=15),
            Sauce.objects.create(name="White Sauce", price=15),
            Sauce.objects.create(name="Garlic", price=10),
        ]

        # ============================================================
        # CHEESES
        # ============================================================

        cheeses = [
            Cheese.objects.create(name="Mozzarella", price=20),
            Cheese.objects.create(name="Cheddar", price=25),
            Cheese.objects.create(name="Parmesan", price=30),
            Cheese.objects.create(name="Feta", price=35),
            Cheese.objects.create(name="Double Cheese", price=50),
        ]

        # ============================================================
        # VEGETABLES
        # ============================================================

        vegetables = [
            Vegetable.objects.create(name="Onions", price=5),
            Vegetable.objects.create(name="Bell Peppers", price=8),
            Vegetable.objects.create(name="Mushrooms", price=10),
            Vegetable.objects.create(name="Olives", price=12),
            Vegetable.objects.create(name="Tomatoes", price=5),
            Vegetable.objects.create(name="Jalapenos", price=7),
            Vegetable.objects.create(name="Spinach", price=8),
            Vegetable.objects.create(name="Corn", price=6),
            Vegetable.objects.create(name="Pineapple", price=10),
            Vegetable.objects.create(name="Broccoli", price=9),
        ]

        # ============================================================
        # PIZZAS - 8 UNIQUE IMAGES
        # ============================================================

        pizzas = [

            {
                "name": "Margherita Magic",
                "category": "pizza",
                "description": "Classic pizza with fresh tomatoes, mozzarella, basil, and oregano",
                "ingredients_text": "Tomato, Mozzarella, Basil",
                "base_price": 299.00,
                "rating": 4.8,
                "review_count": 245,
                "is_featured": True,
                "discount": 10,
                "delivery_time": "20-25 min",
                "image_url": "https://loremflickr.com/900/900/margherita,pizza?lock=101",
            },

            {
                "name": "Pepperoni Passion",
                "category": "pizza",
                "description": "Loaded with spicy pepperoni and extra cheese",
                "ingredients_text": "Pepperoni, Mozzarella, Tomato",
                "base_price": 349.00,
                "rating": 4.7,
                "review_count": 312,
                "is_featured": True,
                "discount": 15,
                "delivery_time": "25-30 min",
                "image_url": "https://loremflickr.com/900/900/pepperoni,pizza?lock=102",
            },

            {
                "name": "Veggie Paradise",
                "category": "pizza",
                "description": "Packed with fresh vegetables and herbs",
                "ingredients_text": "Bell Peppers, Onions, Mushrooms, Olives, Spinach",
                "base_price": 329.00,
                "rating": 4.6,
                "review_count": 187,
                "is_featured": True,
                "discount": 10,
                "delivery_time": "22-28 min",
                "image_url": "https://loremflickr.com/900/900/vegetable,pizza?lock=103",
            },

            {
                "name": "BBQ Chicken Bonanza",
                "category": "pizza",
                "description": "Grilled chicken with BBQ sauce and caramelized onions",
                "ingredients_text": "Chicken, BBQ Sauce, Onions, Cheddar",
                "base_price": 379.00,
                "rating": 4.9,
                "review_count": 428,
                "is_featured": False,
                "discount": 12,
                "delivery_time": "25-32 min",
                "image_url": "https://loremflickr.com/900/900/bbq,chicken,pizza?lock=104",
            },

            {
                "name": "Seafood Supreme",
                "category": "pizza",
                "description": "Premium pizza with shrimp, calamari, and garlic",
                "ingredients_text": "Shrimp, Calamari, Garlic, Mushrooms",
                "base_price": 449.00,
                "rating": 4.5,
                "review_count": 156,
                "is_featured": False,
                "discount": 8,
                "delivery_time": "28-35 min",
                "image_url": "https://loremflickr.com/900/900/seafood,pizza?lock=105",
            },

            {
                "name": "Four Cheese Delight",
                "category": "pizza",
                "description": "Combination of mozzarella, cheddar, parmesan, and feta",
                "ingredients_text": "Mozzarella, Cheddar, Parmesan, Feta",
                "base_price": 389.00,
                "rating": 4.7,
                "review_count": 289,
                "is_featured": False,
                "discount": 10,
                "delivery_time": "23-30 min",
                "image_url": "https://loremflickr.com/900/900/four,cheese,pizza?lock=106",
            },

            {
                "name": "Meat Lovers",
                "category": "pizza",
                "description": "Pepperoni, sausage, bacon, and ham on thick crust",
                "ingredients_text": "Pepperoni, Sausage, Bacon, Ham",
                "base_price": 399.00,
                "rating": 4.8,
                "review_count": 356,
                "is_featured": False,
                "discount": 14,
                "delivery_time": "26-32 min",
                "image_url": "https://loremflickr.com/900/900/meat,pizza?lock=107",
            },

            {
                "name": "Spicy Buffalo",
                "category": "pizza",
                "description": "Chicken with hot buffalo sauce and ranch drizzle",
                "ingredients_text": "Chicken, Buffalo Sauce, Ranch, Cheddar",
                "base_price": 359.00,
                "rating": 4.6,
                "review_count": 198,
                "is_featured": False,
                "discount": 11,
                "delivery_time": "24-30 min",
                "image_url": "https://loremflickr.com/900/900/buffalo,chicken,pizza?lock=108",
            },
        ]

        # ============================================================
        # BURGERS - 4 UNIQUE IMAGES
        # ============================================================

        burgers = [

            {
                "name": "Classic Cheeseburger",
                "category": "burger",
                "description": "Juicy beef patty with melted cheddar and fresh lettuce",
                "ingredients_text": "Beef, Cheddar, Lettuce, Tomato, Pickles",
                "base_price": 199.00,
                "rating": 4.5,
                "review_count": 234,
                "is_featured": False,
                "discount": 10,
                "delivery_time": "15-20 min",
                "image_url": "https://loremflickr.com/900/900/cheeseburger?lock=201",
            },

            {
                "name": "Double Bacon Burger",
                "category": "burger",
                "description": "Double patty with crispy bacon and onion rings",
                "ingredients_text": "Double Beef, Bacon, Cheddar, Onion Rings",
                "base_price": 279.00,
                "rating": 4.7,
                "review_count": 312,
                "is_featured": True,
                "discount": 12,
                "delivery_time": "18-23 min",
                "image_url": "https://loremflickr.com/900/900/bacon,burger?lock=202",
            },

            {
                "name": "Spicy Jalapeno Burger",
                "category": "burger",
                "description": "Beef burger with jalapenos, pepper jack cheese, and chipotle mayo",
                "ingredients_text": "Beef, Jalapenos, Pepper Jack, Chipotle Mayo",
                "base_price": 239.00,
                "rating": 4.6,
                "review_count": 167,
                "is_featured": False,
                "discount": 8,
                "delivery_time": "16-21 min",
                "image_url": "https://loremflickr.com/900/900/jalapeno,burger?lock=203",
            },

            {
                "name": "Mushroom Swiss Burger",
                "category": "burger",
                "description": "Beef with sautéed mushrooms and swiss cheese",
                "ingredients_text": "Beef, Mushrooms, Swiss Cheese, Caramelized Onions",
                "base_price": 249.00,
                "rating": 4.4,
                "review_count": 143,
                "is_featured": False,
                "discount": 10,
                "delivery_time": "17-22 min",
                "image_url": "https://loremflickr.com/900/900/mushroom,burger?lock=204",
            },
        ]

        # ============================================================
        # SIDES - 5 UNIQUE IMAGES
        # ============================================================

        sides = [

            {
                "name": "Crispy French Fries",
                "category": "sides",
                "description": "Golden crispy fries with sea salt",
                "ingredients_text": "Potatoes, Sea Salt",
                "base_price": 99.00,
                "rating": 4.3,
                "review_count": 567,
                "is_featured": False,
                "discount": 5,
                "delivery_time": "8-12 min",
                "image_url": "https://loremflickr.com/900/900/french,fries?lock=301",
            },

            {
                "name": "Cheesy Garlic Bread",
                "category": "sides",
                "description": "Toasted bread with garlic butter and melted cheese",
                "ingredients_text": "Bread, Garlic, Butter, Mozzarella",
                "base_price": 129.00,
                "rating": 4.6,
                "review_count": 423,
                "is_featured": True,
                "discount": 10,
                "delivery_time": "10-15 min",
                "image_url": "https://loremflickr.com/900/900/garlic,bread?lock=302",
            },

            {
                "name": "Loaded Nachos",
                "category": "sides",
                "description": "Nachos with cheese, jalapeños, and sour cream",
                "ingredients_text": "Tortilla Chips, Cheddar, Jalapenos, Sour Cream",
                "base_price": 159.00,
                "rating": 4.5,
                "review_count": 289,
                "is_featured": False,
                "discount": 8,
                "delivery_time": "12-17 min",
                "image_url": "https://loremflickr.com/900/900/loaded,nachos?lock=303",
            },

            {
                "name": "Mozzarella Sticks",
                "category": "sides",
                "description": "Crispy mozzarella sticks with marinara sauce",
                "ingredients_text": "Mozzarella, Breadcrumbs, Marinara",
                "base_price": 149.00,
                "rating": 4.7,
                "review_count": 356,
                "is_featured": False,
                "discount": 12,
                "delivery_time": "10-15 min",
                "image_url": "https://loremflickr.com/900/900/mozzarella,sticks?lock=304",
            },

            {
                "name": "Buffalo Wings",
                "category": "sides",
                "description": "Spicy buffalo wings with blue cheese dip",
                "ingredients_text": "Chicken Wings, Buffalo Sauce, Blue Cheese",
                "base_price": 199.00,
                "rating": 4.8,
                "review_count": 445,
                "is_featured": False,
                "discount": 10,
                "delivery_time": "15-20 min",
                "image_url": "https://loremflickr.com/900/900/buffalo,wings?lock=305",
            },
        ]

        # ============================================================
        # DRINKS - 5 UNIQUE IMAGES
        # ============================================================

        drinks = [

            {
                "name": "Coca Cola",
                "category": "drinks",
                "description": "Ice-cold cola drink (500ml)",
                "ingredients_text": "Carbonated Water, Sugar, Caramel Color",
                "base_price": 49.00,
                "rating": 4.0,
                "review_count": 234,
                "is_featured": False,
                "discount": 0,
                "delivery_time": "2-5 min",
                "image_url": "https://loremflickr.com/900/900/cola,soft,drink?lock=401",
            },

            {
                "name": "Sprite Lemonade",
                "category": "drinks",
                "description": "Refreshing lemon-lime soda (500ml)",
                "ingredients_text": "Carbonated Water, Lemon, Lime",
                "base_price": 49.00,
                "rating": 4.1,
                "review_count": 178,
                "is_featured": False,
                "discount": 0,
                "delivery_time": "2-5 min",
                "image_url": "https://loremflickr.com/900/900/lemon,lime,soda?lock=402",
            },

            {
                "name": "Fresh Mango Shake",
                "category": "drinks",
                "description": "Creamy mango shake with ice cream",
                "ingredients_text": "Mango, Milk, Ice Cream",
                "base_price": 129.00,
                "rating": 4.6,
                "review_count": 289,
                "is_featured": True,
                "discount": 8,
                "delivery_time": "5-10 min",
                "image_url": "https://loremflickr.com/900/900/mango,shake?lock=403",
            },

            {
                "name": "Strawberry Smoothie",
                "category": "drinks",
                "description": "Fresh strawberry smoothie with yogurt",
                "ingredients_text": "Strawberry, Yogurt, Honey",
                "base_price": 119.00,
                "rating": 4.5,
                "review_count": 212,
                "is_featured": False,
                "discount": 7,
                "delivery_time": "5-10 min",
                "image_url": "https://loremflickr.com/900/900/strawberry,smoothie?lock=404",
            },

            {
                "name": "Iced Coffee",
                "category": "drinks",
                "description": "Strong iced coffee with cream and sugar",
                "ingredients_text": "Coffee, Milk, Ice, Sugar",
                "base_price": 99.00,
                "rating": 4.7,
                "review_count": 334,
                "is_featured": False,
                "discount": 10,
                "delivery_time": "5-8 min",
                "image_url": "https://loremflickr.com/900/900/iced,coffee?lock=405",
            },
        ]

        # ============================================================
        # DESSERTS - 5 UNIQUE IMAGES
        # ============================================================

        desserts = [

            {
                "name": "Chocolate Lava Cake",
                "category": "desserts",
                "description": "Warm chocolate cake with melting center",
                "ingredients_text": "Chocolate, Flour, Butter, Eggs",
                "base_price": 149.00,
                "rating": 4.9,
                "review_count": 423,
                "is_featured": True,
                "discount": 12,
                "delivery_time": "8-12 min",
                "image_url": "https://loremflickr.com/900/900/chocolate,lava,cake?lock=501",
            },

            {
                "name": "Cheesecake Delight",
                "category": "desserts",
                "description": "Creamy New York style cheesecake",
                "ingredients_text": "Cream Cheese, Eggs, Sugar, Graham Crackers",
                "base_price": 179.00,
                "rating": 4.8,
                "review_count": 356,
                "is_featured": False,
                "discount": 10,
                "delivery_time": "10-15 min",
                "image_url": "https://loremflickr.com/900/900/cheesecake?lock=502",
            },

            {
                "name": "Brownie Sundae",
                "category": "desserts",
                "description": "Warm brownie with vanilla ice cream and chocolate sauce",
                "ingredients_text": "Brownie, Ice Cream, Chocolate Sauce",
                "base_price": 159.00,
                "rating": 4.7,
                "review_count": 267,
                "is_featured": False,
                "discount": 8,
                "delivery_time": "8-12 min",
                "image_url": "https://loremflickr.com/900/900/brownie,sundae?lock=503",
            },

            {
                "name": "Tiramisu Cup",
                "category": "desserts",
                "description": "Traditional tiramisu with mascarpone and cocoa",
                "ingredients_text": "Mascarpone, Ladyfinger, Cocoa, Coffee",
                "base_price": 169.00,
                "rating": 4.6,
                "review_count": 198,
                "is_featured": False,
                "discount": 10,
                "delivery_time": "5-8 min",
                "image_url": "https://loremflickr.com/900/900/tiramisu,dessert?lock=504",
            },

            {
                "name": "Gulab Jamun Dessert",
                "category": "desserts",
                "description": "Soft gulab jamun balls in warm sugar syrup",
                "ingredients_text": "Milk Powder, Sugar Syrup, Cardamom",
                "base_price": 129.00,
                "rating": 4.5,
                "review_count": 312,
                "is_featured": False,
                "discount": 7,
                "delivery_time": "5-8 min",
                "image_url": "https://loremflickr.com/900/900/gulab,jamun,indian,sweet?lock=505",
            },
        ]

        # ============================================================
        # COMBINE ALL PRODUCTS
        # ============================================================

        all_products = (
            pizzas
            + burgers
            + sides
            + drinks
            + desserts
        )

        # ============================================================
        # CREATE PRODUCTS
        # ============================================================

        for product_data in all_products:
            Pizza.objects.create(**product_data)

        # ============================================================
        # SUCCESS MESSAGE
        # ============================================================

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded {len(all_products)} products"
            )
        )