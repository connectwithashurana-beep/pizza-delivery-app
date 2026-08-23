from rest_framework import serializers
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from decimal import Decimal
from .models import Order, OrderItem, OrderRating
from inventory.models import Pizza, PizzaBase, Sauce, Cheese, Vegetable
from inventory.tasks import reduce_stock


class OrderItemInputSerializer(serializers.Serializer):
    # A cart line is either:
    #   (a) a preset/whole pizza -> pizza_id is set, base/sauce/cheese are optional, or
    #   (b) a fully custom build  -> base_id, sauce_id, cheese_id are all required.
    # base/sauce/cheese are optional here; CreateOrderSerializer.validate() enforces
    # that a preset pizza XOR a full custom selection is actually present.
    pizza_id = serializers.IntegerField(required=False, allow_null=True)
    base_id = serializers.IntegerField(required=False, allow_null=True)
    sauce_id = serializers.IntegerField(required=False, allow_null=True)
    cheese_id = serializers.IntegerField(required=False, allow_null=True)
    vegetable_ids = serializers.ListField(child=serializers.IntegerField(), required=False, default=list)
    quantity = serializers.IntegerField(min_value=1, default=1)


class OrderItemSerializer(serializers.ModelSerializer):
    # Preset-pizza order items legitimately have no base/sauce/cheese
    # selected (see OrderItemInputSerializer) — `source="base.name"` with a
    # plain CharField would raise AttributeError on None and 500 the whole
    # order-detail response, so these use SerializerMethodField instead.
    pizza_name = serializers.SerializerMethodField()
    base_name = serializers.SerializerMethodField()
    sauce_name = serializers.SerializerMethodField()
    cheese_name = serializers.SerializerMethodField()
    vegetable_names = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "pizza_name", "base_name", "sauce_name", "cheese_name", "vegetable_names",
                  "quantity", "unit_price", "total_price"]

    def get_pizza_name(self, obj):
        return obj.pizza.name if obj.pizza_id else "Custom Pizza"

    def get_base_name(self, obj):
        return obj.base.name if obj.base_id else None

    def get_sauce_name(self, obj):
        return obj.sauce.name if obj.sauce_id else None

    def get_cheese_name(self, obj):
        return obj.cheese.name if obj.cheese_id else None

    def get_vegetable_names(self, obj):
        return [v.name for v in obj.vegetables.all()]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "status", "delivery_address", "contact_number", "subtotal", "gst",
                  "delivery_charge", "grand_total", "payment_method", "created_at", "items"]
        # Defense in depth: this serializer is only ever used to render an
        # Order (list/retrieve/create response). Direct writes to an order
        # (status, grand_total, etc.) must only ever happen through the
        # admin-only update_status/cancel actions or the payment-verification
        # flow — never through a raw serializer write.
        read_only_fields = fields


class CreateOrderSerializer(serializers.Serializer):
    delivery_address = serializers.CharField()
    contact_number = serializers.CharField()
    payment_method = serializers.ChoiceField(choices=["COD", "Razorpay", "WALLET"], default="COD")
    items = OrderItemInputSerializer(many=True)

    def validate(self, attrs):
        items_data = attrs.get("items", [])
        errors = {}

        for index, item in enumerate(items_data):
            item_errors = {}

            pizza_id = item.get("pizza_id")
            base_id = item.get("base_id")
            sauce_id = item.get("sauce_id")
            cheese_id = item.get("cheese_id")

            # Must be either a preset pizza, or a complete custom build
            # (base + sauce + cheese all provided). A half-custom item
            # (e.g. only a base with no sauce/cheese) is rejected explicitly
            # instead of failing later with a confusing 500/KeyError.
            is_custom_build = any([base_id, sauce_id, cheese_id])
            if pizza_id is None and not is_custom_build:
                item_errors["non_field_errors"] = [
                    "Provide either pizza_id (preset pizza) or base_id, sauce_id and cheese_id (custom pizza)."
                ]
            elif pizza_id is None and is_custom_build:
                for field_name, value in [("base_id", base_id), ("sauce_id", sauce_id), ("cheese_id", cheese_id)]:
                    if value is None:
                        item_errors[field_name] = ["This field is required for a custom pizza."]

            for field_name, model_cls, value in [
                ("base_id", PizzaBase, base_id),
                ("sauce_id", Sauce, sauce_id),
                ("cheese_id", Cheese, cheese_id),
            ]:
                if value is None:
                    continue
                try:
                    model_cls.objects.get(id=value)
                except ObjectDoesNotExist:
                    item_errors[field_name] = [f"Invalid {model_cls.__name__} ID."]

            if pizza_id is not None:
                try:
                    Pizza.objects.get(id=pizza_id)
                except ObjectDoesNotExist:
                    item_errors["pizza_id"] = ["Invalid Pizza ID."]

            for vegetable_id in item.get("vegetable_ids", []):
                try:
                    Vegetable.objects.get(id=vegetable_id)
                except ObjectDoesNotExist:
                    item_errors.setdefault("vegetable_ids", []).append("Invalid Vegetable ID.")

            if item_errors:
                errors[f"items[{index}]"] = item_errors

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        items_data = validated_data.pop("items")
        payment_method = validated_data.pop("payment_method", "COD")
        subtotal = 0
        computed_items = []

        for item in items_data:
            item["vegetable_ids"] = list(dict.fromkeys(item.get("vegetable_ids", [])))
            base = PizzaBase.objects.get(id=item["base_id"]) if item.get("base_id") else None
            sauce = Sauce.objects.get(id=item["sauce_id"]) if item.get("sauce_id") else None
            cheese = Cheese.objects.get(id=item["cheese_id"]) if item.get("cheese_id") else None
            vegetables = Vegetable.objects.filter(id__in=item.get("vegetable_ids", []))
            pizza = Pizza.objects.filter(id=item.get("pizza_id")).first() if item.get("pizza_id") else None

            # Preset pizza: price is the pizza's own base_price, plus whatever
            # optional extra base/sauce/cheese/veg were added on top of it.
            # Fully custom pizza (no pizza_id): price is built entirely from parts.
            unit_price = 0
            if pizza:
                unit_price += pizza.base_price
            if base:
                unit_price += base.price
            if sauce:
                unit_price += sauce.price
            if cheese:
                unit_price += cheese.price
            unit_price += sum(v.price for v in vegetables)

            total_price = unit_price * item["quantity"]
            subtotal += total_price
            computed_items.append({
                "pizza": pizza, "base": base, "sauce": sauce, "cheese": cheese,
                "vegetables": vegetables, "quantity": item["quantity"],
                "unit_price": unit_price, "total_price": total_price,
            })

        gst = round(float(subtotal) * settings.GST_PERCENT / 100, 2)
        delivery_charge = settings.DELIVERY_CHARGE
        grand_total = float(subtotal) + gst + delivery_charge

        with transaction.atomic():
            user = type(request.user).objects.select_for_update().get(pk=request.user.pk)
            if payment_method == "WALLET":
                total = Decimal(str(grand_total))
                if user.wallet_balance < total:
                    raise serializers.ValidationError({"payment_method": "Insufficient wallet balance for this order."})
                user.wallet_balance -= total
                user.save(update_fields=["wallet_balance"])

            if payment_method in ("COD", "WALLET"):
                for ci in computed_items:
                    for item_type, ingredient in (("base", ci["base"]), ("sauce", ci["sauce"]), ("cheese", ci["cheese"])):
                        if ingredient and not reduce_stock(item_type, ingredient.id, ci["quantity"]):
                            raise serializers.ValidationError({"items": f"{ingredient.name} is unavailable or out of stock."})
                    for vegetable in ci["vegetables"]:
                        if not reduce_stock("vegetable", vegetable.id, ci["quantity"]):
                            raise serializers.ValidationError({"items": f"{vegetable.name} is unavailable or out of stock."})

            order = Order.objects.create(
                user=user,
                delivery_address=validated_data["delivery_address"],
                contact_number=validated_data["contact_number"],
                subtotal=subtotal, gst=gst, delivery_charge=delivery_charge, grand_total=grand_total,
                payment_method=payment_method,
                status="preparing" if payment_method == "WALLET" else "received",
            )

            for ci in computed_items:
                oi = OrderItem.objects.create(
                    order=order, pizza=ci["pizza"], base=ci["base"], sauce=ci["sauce"], cheese=ci["cheese"],
                    quantity=ci["quantity"], unit_price=ci["unit_price"], total_price=ci["total_price"],
                )
                oi.vegetables.set(ci["vegetables"])

        return order


class OrderRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderRating
        fields = ['id', 'rating', 'review_text', 'created_at']
        read_only_fields = ['id', 'created_at']
