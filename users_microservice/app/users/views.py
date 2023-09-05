from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import Group, Permission
from rest_framework import viewsets, generics, status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .custom_permissions import IsOwnerOrAdminOrReadOnly, IsAdminOrReadOnly
from .forms import CustomUserCreationForm
from .models import CustomUser

from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import Group
# from users.custom_permissions import view_user_permission, edit_user_permission, delete_user_permission

from rest_framework_simplejwt.tokens import Token


def verify_token(request_data):
    token = request_data['jwt_token']

    try:
        decoded_token = Token(token)
        user = decoded_token.payload.get('username')

        desired_username = request_data['username']

        if user == desired_username:
            return True
        else:
            return False

    except Exception as e:
        print(f'Ошибка декодирования jwt')


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create' or self.action == 'list':
            # Для создания и просмотра пользователей могут иметь доступ все
            permission_classes = [permissions.AllowAny]
        elif self.action == 'update' or self.action == 'partial_update':
            # Для обновления записи должны быть права как в IsOwnerOrAdminOrReadOnly
            permission_classes = [IsOwnerOrAdminOrReadOnly]
        elif self.action == 'destroy':
            # Для удаления должны быть права как в IsAdminOrReadOnly
            permission_classes = [IsAdminOrReadOnly]
        else:
            # По умолчанию - разрешения только на чтение, как в IsAdminOrReadOnly
            permission_classes = [IsAdminOrReadOnly]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        form = CustomUserCreationForm(request.data)  # Используем CustomUserCreationForm для валидации данных

        if form.is_valid():
            role = request.data.get('role')
            if not role:
                role = 'user'

            if role == 'user':
                user = CustomUser.objects.create_user(
                    username=form.cleaned_data['username'],
                    email=form.cleaned_data['email'],
                    password=form.cleaned_data['password1']
                )
            elif role == 'moderator':
                user = CustomUser.objects.create_moderator(
                    username=form.cleaned_data['username'],
                    email=form.cleaned_data['email'],
                    password=form.cleaned_data['password1']
                )
                moderators_group, created = Group.objects.get_or_create(name='Mods')
                group = Group.objects.get(name='Mods')
                user.groups.add(group)
                user.save()
            else:
                return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance == request.user or request.user.is_staff:
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
