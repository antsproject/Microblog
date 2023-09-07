import logging
import os
import requests

from django_filters.rest_framework import DjangoFilterBackend, CharFilter
from django_filters import rest_framework as filters
from dotenv import load_dotenv
from pathlib import Path
from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import Group

from .custom_permissions import IsOwnerOrAdminOrReadOnly, IsAdminOrReadOnly
from .forms import CustomUserCreationForm
from .models import CustomUser
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, CustomUserActivationSerializer


logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv('./.env')

API_MAILER_URI = os.getenv('API_MAILER_URI')
USERS_MICROSERVICE_URL = os.getenv('USERS_MICROSERVICE_URL')


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


class CustomUserFilter(filters.FilterSet):
    class Meta:
        model = CustomUser
        fields = {
            'username': ['exact'],
            'email': ['exact'],
        }


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    filterset_class = CustomUserFilter

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
        elif self.action == 'list' or self.action == 'retrieve':
            # Просматривать список пользователей и конкретного пользователя могут все
            permission_classes = [permissions.AllowAny]
        else:
            # По умолчанию - разрешения только на чтение, как в IsAdminOrReadOnly
            permission_classes = [IsAdminOrReadOnly]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        users = self.filter_queryset(self.get_queryset())
        serializer = self.serializer_class(users, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.serializer_class(user)
        return Response(serializer.data)

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
                logger.info(f"Creating user with username: {user.username}")

                try:

                    api_url = API_MAILER_URI
                    data_to_send = {
                        "receiver": user.email,
                        "topic": "Activation",
                        "template": "activate",
                        "data": {
                            "username": user.username,
                            "link": f"{USERS_MICROSERVICE_URL}/account_activation/?id={user.id}"
                        }
                    }
                    response = requests.post(api_url, json=data_to_send, verify=False)

                    if response.status_code == 200:
                        logger.info(f'An activation email was successfully sent to user {user.username}')
                    else:
                        logger.error(f'An error occurred while sending the activation email: {response.status_code}')
                        logger.error(response.text)

                except Exception as e:
                    logger.error(f'An error occurred when sending a request to another API: {str(e)}')

            elif role == 'moderator':
                user = CustomUser.objects.create_moderator(
                    username=form.cleaned_data['username'],
                    email=form.cleaned_data['email'],
                    password=form.cleaned_data['password1']
                )
                moderators_group, created = Group.objects.get_or_create(name='Mods')
                group = Group.objects.get(name='Mods')
                user.groups.add(group)
                logger.info(f"Creating user with username: {user.username}")
                user.save()
            else:
                return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        user = CustomUser.objects.get(username=kwargs['pk'])

        if user == request.user or request.user.is_superuser:
            serializer = self.get_serializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        user = CustomUser.objects.get(username=kwargs['pk'])

        if user == request.user or request.user.is_superuser:
            serializer = self.get_serializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        try:
            user = CustomUser.objects.get(username=kwargs['pk'])
            logger.info(f"Deleting user with username: {user.username}")

            if (user == request.user or request.user.is_staff) and not user.is_staff:
                # "Удалить" или забанить может пользователь сам себя, либо модератор, но не другого модератора
                user.is_active = False
                user.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class AccountActivationView(APIView):
    def get(self, request):
        user_id = request.query_params.get('id', None)

        serializer = CustomUserActivationSerializer(data={'id': user_id})

        if serializer.is_valid():
            user = serializer.activate_user()
            return Response({"message": "Account activated"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
