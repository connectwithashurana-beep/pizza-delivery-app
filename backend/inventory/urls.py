from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("pizzas", views.PizzaViewSet, basename="pizza")
router.register("bases", views.PizzaBaseViewSet, basename="base")
router.register("sauces", views.SauceViewSet, basename="sauce")
router.register("cheeses", views.CheeseViewSet, basename="cheese")
router.register("vegetables", views.VegetableViewSet, basename="vegetable")

urlpatterns = router.urls
