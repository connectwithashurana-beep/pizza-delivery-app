from django.contrib import admin
from .models import Pizza, PizzaBase, Sauce, Cheese, Vegetable, InventoryLog, Rating

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('id', 'pizza', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('pizza__name', 'user__email')
    readonly_fields = ('created_at',)

admin.site.register(Pizza)
admin.site.register(PizzaBase)
admin.site.register(Sauce)
admin.site.register(Cheese)
admin.site.register(Vegetable)
admin.site.register(InventoryLog)
