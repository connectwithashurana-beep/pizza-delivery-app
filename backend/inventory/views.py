from rest_framework import viewsets, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from accounts.authentication import OptionalJWTAuthentication
from .models import Pizza, PizzaBase, Sauce, Cheese, Vegetable, Rating
from .serializers import (
    PizzaSerializer, PizzaBaseSerializer, SauceSerializer, CheeseSerializer, VegetableSerializer,
    RatingSerializer,
)
from .permissions import IsAdminOrReadOnly


class PublicReadMixin:
    """Shared get_permissions/get_authenticators for list+retrieve-is-public,
    write-is-admin-only viewsets.

    A stale/expired JWT must never turn a public GET (menu browsing) into a
    401 — see accounts/authentication.OptionalJWTAuthentication. Write
    actions still use strict JWTAuthentication so admin permission checks
    behave normally.
    """

    def get_permissions(self):
        if hasattr(self, 'action') and self.action in ("list", "retrieve"):
            return [AllowAny()]
        return super().get_permissions()

    def get_authenticators(self):
        # Check action if available, otherwise allow all (for OPTIONS/etc)
        if hasattr(self, 'action') and self.action in ("list", "retrieve"):
            return [OptionalJWTAuthentication()]
        return [JWTAuthentication()]


class PizzaViewSet(PublicReadMixin, viewsets.ModelViewSet):
    queryset = Pizza.objects.all().order_by("-created_at")
    serializer_class = PizzaSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["is_available", "is_featured", "category"]
    search_fields = ["name", "description"]
    ordering_fields = ["base_price", "created_at", "rating"]
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def rate(self, request, pk=None):
        """Rate a pizza product"""
        pizza = self.get_object()
        rating_value = request.data.get('rating')
        review_text = request.data.get('review_text', '')
        
        if not rating_value:
            return Response(
                {"detail": "rating field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            rating_value = int(rating_value)
            if rating_value < 1 or rating_value > 5:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {"detail": "rating must be an integer between 1 and 5."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create or update rating
        rating, created = Rating.objects.update_or_create(
            pizza=pizza,
            user=request.user,
            defaults={'rating': rating_value, 'review_text': review_text}
        )
        
        # Recalculate pizza rating average
        pizza_ratings = pizza.ratings.all()
        if pizza_ratings.exists():
            avg_rating = sum(r.rating for r in pizza_ratings) / len(pizza_ratings)
            pizza.rating = round(avg_rating, 1)
            pizza.review_count = pizza_ratings.count()
            pizza.save()
        
        serializer = RatingSerializer(rating)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PizzaBaseViewSet(PublicReadMixin, viewsets.ModelViewSet):
    queryset = PizzaBase.objects.all()
    serializer_class = PizzaBaseSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ["name"]


class SauceViewSet(PublicReadMixin, viewsets.ModelViewSet):
    queryset = Sauce.objects.all()
    serializer_class = SauceSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ["name"]


class CheeseViewSet(PublicReadMixin, viewsets.ModelViewSet):
    queryset = Cheese.objects.all()
    serializer_class = CheeseSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ["name"]


class VegetableViewSet(PublicReadMixin, viewsets.ModelViewSet):
    queryset = Vegetable.objects.all()
    serializer_class = VegetableSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ["name"]
