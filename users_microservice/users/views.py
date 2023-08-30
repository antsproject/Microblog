from django.http import Http404
from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.permissions import AllowAny

from .serializers import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RegisterUserAPIView(generics.CreateAPIView):
    model = get_user_model()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

