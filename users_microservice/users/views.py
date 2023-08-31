from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny
from .models import Users

from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView


class UserViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer


class RegisterUserAPIView(generics.CreateAPIView):
    model = Users
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
