from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import CustomUser

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['is_superuser'] = user.is_superuser
        token['is_staff'] = user.is_staff

        return token

    def validate(self, attrs):
        username = attrs.get(self.username_field)
        user = CustomUser.objects.filter(username=username).first()

        if user is None:
            raise serializers.ValidationError("User with this username was not found")

        if not user.check_password(attrs['password']):
            raise serializers.ValidationError("Incorrect password")

        return super().validate(attrs)


class CustomUserActivationSerializer(serializers.Serializer):
    id = serializers.UUIDField()

    def activate_user(self):
        try:
            user = CustomUser.objects.get(id=self.validated_data['id'])
            user.is_active = True
            user.save()
            return user
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this username was not found")
