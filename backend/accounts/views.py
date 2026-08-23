from datetime import timedelta
from django.contrib.auth import authenticate
from django.conf import settings
from django.core.mail import BadHeaderError, EmailMessage, send_mail
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
import random
import string

from .models import User, EmailVerificationToken, PasswordResetToken, OTP
from .serializers import (
    RegisterSerializer, UserSerializer, ChangePasswordSerializer,
    ForgotPasswordSerializer, ResetPasswordSerializer, ContactSerializer,
    SendOTPSerializer, VerifyOTPSerializer,
)
from .tasks import send_verification_email, send_password_reset_email


def tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_scope = "auth"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        vt = EmailVerificationToken.objects.create(user=user)
        try:
            if settings.DEBUG:
                send_verification_email.delay(user.email, str(vt.token))
            else:
                send_verification_email(user.email, str(vt.token))
        except Exception:
            vt.delete()
            user.delete()
            return Response(
                {"detail": "Unable to send a verification email right now. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response(
            {"message": "Registration successful. Please check your email to verify your account."},
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, token):
        from django.conf import settings as dj_settings
        try:
            vt = EmailVerificationToken.objects.get(token=token, is_used=False)
        except EmailVerificationToken.DoesNotExist:
            return Response({"detail": "Invalid or expired token."}, status=400)

        expiry = vt.created_at + timedelta(hours=dj_settings.EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS)
        if timezone.now() > expiry:
            return Response({"detail": "Invalid or expired token."}, status=400)

        vt.is_used = True
        vt.save()
        user = vt.user
        user.is_email_verified = True
        user.save()
        return Response({"message": "Email verified successfully."})


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_scope = "auth"

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, username=email, password=password)
        if not user:
            return Response({"detail": "Invalid credentials."}, status=401)
        data = tokens_for_user(user)
        data["user"] = UserSerializer(user).data
        return Response(data)


class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_scope = "auth"

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, username=email, password=password)
        if not user or user.role not in ("admin", "superadmin"):
            return Response({"detail": "Invalid admin credentials."}, status=401)
        data = tokens_for_user(user)
        data["user"] = UserSerializer(user).data
        return Response(data)


class LogoutView(APIView):
    def post(self, request):
        refresh = request.data.get("refresh")
        if not refresh:
            return Response({"detail": "Refresh token is required."}, status=400)
        try:
            RefreshToken(refresh).blacklist()
        except TokenError:
            # Token was already invalid/expired/blacklisted — client-side
            # state is effectively already logged out, so treat this as
            # success rather than surfacing an error the user can't act on.
            pass
        return Response({"message": "Logged out."})


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"detail": "Old password incorrect."}, status=400)
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"message": "Password changed."})


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_scope = "auth"

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(email=serializer.validated_data["email"])
        except User.DoesNotExist:
            return Response({"message": "If that email exists, a reset link was sent."})
        rt = PasswordResetToken.objects.create(user=user)
        try:
            if settings.DEBUG:
                send_password_reset_email.delay(user.email, str(rt.token))
            else:
                send_password_reset_email(user.email, str(rt.token))
        except Exception:
            rt.delete()
            return Response(
                {"detail": "Unable to send a reset link right now. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({"message": "If that email exists, a reset link was sent."})


class ContactView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_scope = "contact"

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        body = (
            f"Name: {data['name']}\n"
            f"Email: {data['email']}\n"
            f"Phone: {data.get('phone') or 'Not provided'}\n\n"
            f"Message:\n{data['message']}"
        )
        try:
            EmailMessage(
                "PizzaHub contact form message",
                body,
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
                reply_to=[data["email"]],
            ).send(fail_silently=False)
        except (BadHeaderError, OSError):
            return Response(
                {"detail": "Unable to send your message right now. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except Exception:
            return Response(
                {"detail": "Unable to send your message right now. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({"message": "Message sent successfully."}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        from django.conf import settings as dj_settings
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            rt = PasswordResetToken.objects.get(token=serializer.validated_data["token"], is_used=False)
        except PasswordResetToken.DoesNotExist:
            return Response({"detail": "Invalid or expired token."}, status=400)

        expiry = rt.created_at + timedelta(minutes=dj_settings.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES)
        if timezone.now() > expiry:
            return Response({"detail": "Invalid or expired token."}, status=400)

        user = rt.user
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        rt.is_used = True
        rt.save()
        # Invalidate any other outstanding reset tokens for this user so an
        # old, unused link can't still be used after a successful reset.
        PasswordResetToken.objects.filter(user=user, is_used=False).exclude(id=rt.id).update(is_used=True)
        return Response({"message": "Password reset successful."})


class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_scope = "auth"
    
    def post(self, request):
        from django.conf import settings as dj_settings
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        otp_type = serializer.validated_data['otp_type']
        contact = serializer.validated_data['contact']
        
        # Generate 6-digit OTP
        otp_code = ''.join(random.choices(string.digits, k=6))
        
        # Get or create user based on email/phone
        if otp_type == 'email':
            try:
                user = User.objects.get(email=contact)
            except User.DoesNotExist:
                return Response(
                    {"detail": "User not found with this email."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:  # phone
            try:
                user = User.objects.get(phone=contact)
            except User.DoesNotExist:
                return Response(
                    {"detail": "User not found with this phone."},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Set expiry to 10 minutes from now
        expires_at = timezone.now() + timedelta(minutes=10)
        
        # Create OTP record
        OTP.objects.filter(user=user, otp_type=otp_type, is_verified=False).delete()
        otp = OTP.objects.create(
            user=user,
            otp_type=otp_type,
            otp_code=otp_code,
            contact=contact,
            expires_at=expires_at
        )
        
        if otp_type == "email":
            try:
                send_mail(
                    "Your PizzaHub verification code",
                    f"Your verification code is {otp_code}. It expires in 10 minutes.",
                    settings.DEFAULT_FROM_EMAIL,
                    [contact],
                    fail_silently=False,
                )
            except Exception:
                otp.delete()
                return Response(
                    {"detail": "Unable to send the verification code right now."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
        else:
            otp.delete()
            return Response(
                {"detail": "Phone verification is not configured yet."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response({
            "message": f"OTP sent to {contact}",
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_scope = "auth"
    
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        otp_type = serializer.validated_data['otp_type']
        otp_code = serializer.validated_data['otp_code']
        contact = serializer.validated_data['contact']
        
        try:
            otp = OTP.objects.get(otp_type=otp_type, contact=contact, is_verified=False)
        except OTP.DoesNotExist:
            return Response(
                {"detail": "Invalid OTP."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if OTP expired
        if timezone.now() > otp.expires_at:
            return Response(
                {"detail": "OTP has expired."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check max attempts
        if otp.attempts >= 3:
            otp.delete()
            return Response(
                {"detail": "Maximum attempts exceeded. Request a new OTP."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if otp.otp_code != otp_code:
            otp.attempts += 1
            otp.save(update_fields=["attempts"])
            return Response(
                {"detail": "Invalid OTP."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Mark OTP as verified
        otp.is_verified = True
        otp.save()
        
        # Update user verification status
        user = otp.user
        if otp_type == 'email':
            user.is_email_verified = True
        else:  # phone
            user.is_phone_verified = True
        user.save()
        
        return Response({
            "message": f"{otp_type.capitalize()} verified successfully.",
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)
