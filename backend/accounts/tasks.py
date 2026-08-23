from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail


@shared_task
def send_verification_email(email, token):
    link = f"{settings.FRONTEND_URL}/verify-email/{token}"
    send_mail(
        "Verify your Pizza Delivery account",
        f"Click the link to verify your email: {link}",
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )


@shared_task
def send_password_reset_email(email, token):
    link = f"{settings.FRONTEND_URL}/reset-password/{token}"
    send_mail(
        "Reset your password",
        f"Click the link to reset your password: {link}",
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )
