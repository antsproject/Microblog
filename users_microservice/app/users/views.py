import logging
import os
import requests

from django_filters.rest_framework import DjangoFilterBackend, CharFilter
from django_filters import rest_framework as filters
from dotenv import load_dotenv
from pathlib import Path
from rest_framework import viewsets, generics, status, permissions, pagination
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import Group

from .custom_permissions import IsOwnerOrAdminOrReadOnly, IsAdminOrReadOnly
from .forms import CustomUserCreationForm
from .models import CustomUser
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, CustomUserActivationSerializer, \
    UserFilterSerializer

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv('./.env')

API_MAILER_URI = os.getenv('API_MAILER_URI')
USERS_MICROSERVICE_URL = os.getenv('USERS_MICROSERVICE_URL')


class CustomUserPagination(pagination.PageNumberPagination):
    page_size = 100


class CustomUserFilter(filters.FilterSet):
    id_list = filters.CharFilter(method='filter_id_list')

    def filter_id_list(self, queryset, name, value):
        ids = value.split(',')
        return queryset.filter(id__in=ids)

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
    pagination_class = CustomUserPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        # Если есть параметр id_list в запросе, фильтруем пользователей по этому списку ID
        id_list = self.request.query_params.get('id_list')
        if id_list:
            return queryset.filter(id__in=id_list.split(','))
        return queryset

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
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        fields = request.query_params.get('fields')
        serializer = self.serializer_class(page, many=True,
                                           context={'fields': fields})
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        fields = request.query_params.get('fields')
        serializer = self.serializer_class(user, context={'fields': fields})
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
                            "link": f"{USERS_MICROSERVICE_URL}/api/auth/activation/?id={user.id}"
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

            response_data = {
                "message": "User created",
                "data": serializer.data
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        user = self.get_object()

        if user == request.user or request.user.is_superuser:
            serializer = self.get_serializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()

                response_data = {
                    "message": "User data changed",
                    "data": serializer.data
                }

                return Response(response_data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        user = self.get_object()

        if user == request.user or request.user.is_superuser:
            serializer = self.get_serializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()

                response_data = {
                    "message": "User data changed",
                    "data": serializer.data
                }

                return Response(response_data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        try:
            user = self.get_object()
            logger.info(f"Deleting user with username: {user.username}")

            if request.user.is_staff and not user.is_staff:
                # "Удалить" или забанить может только модератор, но не другого модератора
                user.is_active = False
                user.save()
                return Response({"message": "User account has been deactivated"})
            else:
                return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class UserFilterView(APIView):
    def post(self, request, format=None):
        serializer = UserFilterSerializer(data=request.data)
        if serializer.is_valid():
            user_ids = serializer.validated_data.get('user_ids', [])
            fields = request.data.get('fields', [])

            if isinstance(fields, list):
                fields = ','.join(fields)

            if user_ids:
                queryset = CustomUser.objects.filter(id__in=user_ids)
            else:
                queryset = CustomUser.objects.all()

            serializer = UserSerializer(
                queryset, many=True, context={'fields': fields}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
