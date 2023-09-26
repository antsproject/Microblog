from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth import authenticate, get_user_model
from .models import CustomUser, Subscription, ActivationToken

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(use_url=True)

    class Meta:
        model = CustomUser
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        fields = self.context.get('fields')

        default_fields = ['id', 'avatar', 'username', 'email', 'status', 'is_active', 'is_staff',
                          'is_superuser', 'date_joined', 'slug']

        if fields:
            allowed_fields = set(fields.split(','))
        else:
            allowed_fields = set(default_fields)

        return {key: value for key, value in data.items() if key in allowed_fields}


class UserFilterSerializer(serializers.Serializer):
    user_ids = serializers.ListField(child=serializers.IntegerField(), required=False)


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get("email", None)
        password = data.get("password", None)

        if email is None:
            raise serializers.ValidationError("An email address is required to log in.")
        if password is None:
            raise serializers.ValidationError("A password is required to log in.")

        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError("A user with this email and password was not found.")

        if not user.is_active:
            raise serializers.ValidationError("User is inactive and cannot obtain a token.")

        data["user"] = user
        return data


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        decoded_access_token = AccessToken(data['access'])
        user_id = decoded_access_token.get('user_id')

        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        if not user.is_active:
            raise serializers.ValidationError(f"{user} is inactive and cannot refresh the token.")

        return data


class CustomUserActivationSerializer(serializers.Serializer):
    id = serializers.IntegerField()

    def activate_user(self):
        try:
            user = CustomUser.objects.get(id=self.validated_data['id'])
            user.is_active = True
            user.save()
            return user
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this username was not found")


class ActivationTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivationToken
        fields = '__all__'