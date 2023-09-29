import logging
import os
import requests
from django.utils.crypto import get_random_string

from django_filters.rest_framework import DjangoFilterBackend, CharFilter
from django_filters import rest_framework as filters
from dotenv import load_dotenv
from pathlib import Path
from rest_framework import viewsets, generics, status, permissions, pagination
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import Token, RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404

from .custom_permissions import IsOwnerOrModOrReadOnly, IsModOrReadOnly, IsOwnerOnly
from .forms import CustomUserCreationForm
from .models import CustomUser, Subscription, ActivationToken
from .serializers import UserSerializer, LoginSerializer, CustomUserActivationSerializer, \
    UserFilterSerializer, SubscriptionSerializer, CustomTokenRefreshSerializer
from .utils import ensure_trailing_slash

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv('./.env')

MAIL_MICROSERVICE_URL = ensure_trailing_slash(os.getenv('MAIL_MICROSERVICE_URL'))
USERS_MICROSERVICE_URL = ensure_trailing_slash(os.getenv('USERS_MICROSERVICE_URL'))


class CustomUserPagination(pagination.PageNumberPagination):
    page_size = 100


class CustomSubscriptionsPagination(pagination.PageNumberPagination):
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
            # Для обновления записи должны быть права как в IsOwnerOrModOrReadOnly
            permission_classes = [IsOwnerOrModOrReadOnly]
        elif self.action == 'destroy':
            # Для удаления должны быть права как в IsModOrReadOnly
            permission_classes = [IsModOrReadOnly]
        elif self.action == 'list' or self.action == 'retrieve':
            # Просматривать список пользователей и конкретного пользователя могут все
            permission_classes = [permissions.AllowAny]
        else:
            # По умолчанию - разрешения только на чтение, как в IsModOrReadOnly
            permission_classes = [IsModOrReadOnly]
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

                token = get_random_string(length=32)

                activation_token = ActivationToken.objects.create(user=user, token=token)
                logger.info(f"activation_token: {activation_token.user} {activation_token.token}")
                try:
                    api_url = f'{MAIL_MICROSERVICE_URL}send'
                    data_to_send = {
                        "receiver": user.email,
                        "topic": "Activation",
                        "template": "activate",
                        "data": {
                            "username": user.username,
                            "link": f"127.0.0.1:80/activation/?token={token}"
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


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    pagination_class = CustomSubscriptionsPagination
    permission_classes = [IsOwnerOnly]

    def perform_create(self, serializer):
        subscriber_uuid = self.request.data.get('subscriber')
        subscribed_to_uuid = self.request.data.get('subscribed_to')

        try:
            subscriber = CustomUser.objects.get(id=subscriber_uuid)
            subscribed_to = CustomUser.objects.get(id=subscribed_to_uuid)
        except CustomUser.DoesNotExist:
            return Response({"error": "One or both users do not exist."}, status=status.HTTP_400_BAD_REQUEST)

        if subscriber == subscribed_to:
            return Response({"error": "Cannot subscribe to yourself."}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(subscriber=subscriber, subscribed_to=subscribed_to)

    def get_queryset(self):
        queryset = Subscription.objects.all()
        return queryset

    def create(self, request, *args, **kwargs):
        subscriber_id = request.data.get('subscriber')
        subscribed_to_id = request.data.get('subscribed_to')

        if subscriber_id is None or subscribed_to_id is None:
            response_data = {
                "message": "Both 'subscriber' and 'subscribed_to' fields are required in the request body."
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            subscriber = CustomUser.objects.get(id=subscriber_id)
            subscribed_to = CustomUser.objects.get(id=subscribed_to_id)
        except CustomUser.DoesNotExist:
            response_data = {
                "message": "One or both users do not exist."
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        if subscriber == subscribed_to:
            response_data = {
                "message": "Cannot subscribe to yourself."
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        subscription, created = Subscription.objects.get_or_create(
            subscriber=subscriber, subscribed_to=subscribed_to
        )

        if created:
            response_data = {
                "message": "Subscription created successfully",
                "data": SubscriptionSerializer(subscription).data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            response_data = {
                "message": "Subscription already exists."
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        subscriber = request.query_params.get('subscriber')
        subscribed_to = request.query_params.get('subscribed_to')

        if not subscriber or not subscribed_to:
            response_data = {
                "message": "Both 'subscriber_id' and 'subscribed_to_id' parameters are required in the request URL."}
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            subscription = Subscription.objects.get(subscriber=subscriber, subscribed_to=subscribed_to)
            subscription.delete()
            response_data = {"message": "Subscription deleted successfully."}
            return Response(response_data, status=status.HTTP_204_NO_CONTENT)

        except Subscription.DoesNotExist:
            response_data = {"message": "Subscription not found."}
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

    def list(self, request, *args, **kwargs):
        from_id = self.request.query_params.get('from-id')
        to_id = self.request.query_params.get('to-id')

        if from_id and to_id:
            queryset = Subscription.objects.filter(subscriber=from_id, subscribed_to=to_id)
            is_subscribed = queryset.exists()
            count = queryset.count()

            response_data = {'is_subscribed': is_subscribed, 'total_subscriptions': count}
        else:
            if from_id:
                queryset = Subscription.objects.filter(subscriber=from_id)
            elif to_id:
                queryset = Subscription.objects.filter(subscribed_to=to_id)
            else:
                queryset = Subscription.objects.all()

            page = self.paginate_queryset(queryset)
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        return Response(response_data, status=status.HTTP_200_OK)

    def to_user(self, request, pk):
        user = get_object_or_404(CustomUser, id=pk)
        subscriptions = Subscription.objects.filter(subscribed_to=user)

        paginator = PageNumberPagination()
        paginator.page_size = 100

        page = paginator.paginate_queryset(subscriptions, request)

        users = [subscription.subscriber for subscription in page]
        serializer = UserSerializer(users, many=True)

        return paginator.get_paginated_response(serializer.data)

    def from_user(self, request, pk):
        user = get_object_or_404(CustomUser, id=pk)
        subscriptions = Subscription.objects.filter(subscriber=user)

        paginator = PageNumberPagination()
        paginator.page_size = 100

        page = paginator.paginate_queryset(subscriptions, request)

        users = [subscription.subscribed_to for subscription in page]
        serializer = UserSerializer(users, many=True)

        return paginator.get_paginated_response(serializer.data)


class CustomRefreshToken(RefreshToken):

    @classmethod
    def for_user(cls, user):
        token = super().for_user(user)

        token.payload.update({
            'id': user.id,
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff,
        })

        return token


class LoginAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = CustomRefreshToken.for_user(user)

        context = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "id": user.id
        }
        return Response(context, status=status.HTTP_200_OK)


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer


class AccountActivationView(APIView):
    def get(self, request):
        token = request.query_params.get('token', None)
        logger.info(f"token - {token}")
        try:
            activation_token = ActivationToken.objects.get(token=token)
            logger.info(f"activation_token - {activation_token}")
            user = activation_token.user
            logger.info(f"user - {user}")

            user.is_active = True
            user.save()

        except ActivationToken.DoesNotExist:
            return Response({"error": "Invalid activation token"}, status=status.HTTP_400_BAD_REQUEST)

        activation_token.delete()

        return Response({"message": "Account activated"}, status=status.HTTP_200_OK)
