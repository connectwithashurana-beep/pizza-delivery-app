from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view()),
    path("verify-email/<uuid:token>/", views.VerifyEmailView.as_view()),
    path("login/", views.LoginView.as_view()),
    path("admin-login/", views.AdminLoginView.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("profile/", views.ProfileView.as_view()),
    path("change-password/", views.ChangePasswordView.as_view()),
    path("forgot-password/", views.ForgotPasswordView.as_view()),
    path("contact/", views.ContactView.as_view()),
    path("reset-password/", views.ResetPasswordView.as_view()),
    path("send-otp/", views.SendOTPView.as_view()),
    path("verify-otp/", views.VerifyOTPView.as_view()),
]
