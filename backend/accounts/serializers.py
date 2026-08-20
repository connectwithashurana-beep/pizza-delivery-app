import re

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User, OTP


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirmPassword = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "confirmPassword", "phone", "address"]

    def _generate_unique_username(self, email):
        base = email.split("@", 1)[0].strip().lower()
        base = re.sub(r"[^a-z0-9._-]+", "", base) or "user"
        candidate = base[:30]
        suffix = 1
        while User.objects.filter(username__iexact=candidate).exists():
            candidate = f"{base[:24]}{suffix}"
            suffix += 1
        return candidate

    def validate(self, attrs):
        password = attrs.get("password")
        confirm_password = attrs.pop("confirmPassword", None)

        if not confirm_password:
            raise serializers.ValidationError({"confirmPassword": "Confirm password is required."})
        if password != confirm_password:
            raise serializers.ValidationError({"confirmPassword": "Passwords do not match."})

        email = attrs.get("email")
        username = attrs.get("username")
        if email and User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "A user with that email already exists."})
        if username and User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({"username": "A user with that username already exists."})

        return attrs

    def create(self, validated_data):
        email = validated_data["email"]
        username = (validated_data.get("username") or "").strip()
        if not username:
            username = self._generate_unique_username(email)
        validated_data["username"] = username

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data["password"],
            phone=validated_data.get("phone", ""),
            address=validated_data.get("address", ""),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "address", "wallet_balance", "role", "is_email_verified"]
        read_only_fields = ["role", "is_email_verified", "email", "wallet_balance"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    new_password = serializers.CharField(validators=[validate_password])


class SendOTPSerializer(serializers.Serializer):
    otp_type = serializers.ChoiceField(choices=['email', 'phone'])
    contact = serializers.CharField()


class VerifyOTPSerializer(serializers.Serializer):
    otp_type = serializers.ChoiceField(choices=['email', 'phone'])
    otp_code = serializers.CharField(max_length=6)
    contact = serializers.CharField()


class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ['id', 'otp_type', 'contact', 'is_verified', 'created_at', 'expires_at']
        read_only_fields = ['id', 'created_at', 'expires_at', 'is_verified']
