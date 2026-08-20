from rest_framework import serializers
from .models import Pizza, PizzaBase, Sauce, Cheese, Vegetable, Rating


class PizzaBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PizzaBase
        fields = "__all__"


class SauceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sauce
        fields = "__all__"


class CheeseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cheese
        fields = "__all__"


class VegetableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vegetable
        fields = "__all__"


class RatingSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(
        source="user.email",
        read_only=True
    )

    user_name = serializers.CharField(
        source="user.get_full_name",
        read_only=True
    )

    class Meta:
        model = Rating
        fields = [
            "id",
            "rating",
            "review_text",
            "user_email",
            "user_name",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


class PizzaSerializer(serializers.ModelSerializer):
    ratings = RatingSerializer(many=True, read_only=True)

    # Frontend ke liye final image URL
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        """
        image_url ko priority do.
        Agar image_url nahi hai to uploaded image use karo.
        """

        # 1. External image URL
        if obj.image_url:
            return obj.image_url

        # 2. Uploaded image
        if obj.image:
            request = self.context.get("request")

            if request:
                return request.build_absolute_uri(obj.image.url)

            return obj.image.url

        # 3. No image
        return None

    class Meta:
        model = Pizza
        fields = "__all__"


class PizzaDetailSerializer(serializers.ModelSerializer):
    ratings = RatingSerializer(many=True, read_only=True)

    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        """
        image_url ko priority do.
        Agar image_url nahi hai to uploaded image use karo.
        """

        # 1. External image URL
        if obj.image_url:
            return obj.image_url

        # 2. Uploaded image
        if obj.image:
            request = self.context.get("request")

            if request:
                return request.build_absolute_uri(obj.image.url)

            return obj.image.url

        # 3. No image
        return None

    class Meta:
        model = Pizza
        fields = "__all__"