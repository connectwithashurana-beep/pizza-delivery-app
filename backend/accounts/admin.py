from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, OTP


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "username", "role", "is_email_verified", "is_phone_verified", "is_active")
    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("phone", "address", "role", "is_email_verified", "is_phone_verified")}),
    )


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'otp_type', 'contact', 'is_verified', 'expires_at')
    list_filter = ('otp_type', 'is_verified', 'created_at')
    search_fields = ('user__email', 'contact')
    readonly_fields = ('otp_code', 'created_at')
    
    def has_add_permission(self, request):
        return False  # Prevent manual OTP creation in admin
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
