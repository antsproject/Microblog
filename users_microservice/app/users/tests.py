import json

import requests
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from .views import USERS_MICROSERVICE_URL
from .models import CustomUser, Subscription
from .serializers import UserSerializer, SubscriptionSerializer


class AuthenticatedTestCase(APITestCase):

    def authenticate(self, email, password):
        self.token_url = f"{USERS_MICROSERVICE_URL}api/auth/token/"

        self.login_data = {
            "email": email,
            "password": password,
        }

        self.token_response = self.client.post(self.token_url, self.login_data, format='json')
        access_token = self.token_response.data.get('access')
        headers = {
            'Authorization': f'Bearer {access_token}',
        }

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        return headers


class CustomUserAPITestCase(AuthenticatedTestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_moderator(
            username='moderator',
            email='mod@example.com',
            password='moderatorpassword'
        )

        self.user2 = CustomUser.objects.create_user(
            username='test_user100',
            email='test_user100@example.com',
            password='iloveapple2000'
        )

        self.headers = self.authenticate('mod@example.com', 'moderatorpassword')

    def test_create_user(self):
        url = reverse("customuser-list")
        data = {
            "username": "newuser_test",
            "email": "newuser215@example.com",
            "password1": "iloveapple2000",
            "password2": "iloveapple2000"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_login(self):
        response = self.client.post(self.token_url, self.login_data, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertTrue('access' in response.data)

    def test_refresh_token(self):
        refresh_url = reverse("token_refresh")
        refresh_token = self.token_response.data.get('refresh')

        request_body = {
            "refresh": refresh_token
        }
        response = self.client.post(refresh_url, request_body, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertTrue('access' in response.data)

    def test_list_users(self):
        url = reverse("customuser-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_user(self):
        url = reverse("customuser-detail", args=[self.user1.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_change_user(self):
        updated_data = {"username": "Константин Иванович"}

        url = reverse("customuser-detail", args=[self.user1.id])
        response = self.client.patch(url, updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_ban_user(self):
        url = reverse("customuser-detail", args=[self.user2.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(not self.user2.is_active)


class SubscriptionAPITestCase(AuthenticatedTestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            username="user1",
            email="user111@example.com",
            password="iloveapple2000",
            is_active=True
        )
        self.user2 = CustomUser.objects.create_user(
            username="user2",
            email="user222@example.com",
            password="iloveapple2000",
            is_active=True
        )
        self.subscription = Subscription.objects.create(
            subscriber=self.user1, subscribed_to=self.user2
        )

        self.headers = self.authenticate('user111@example.com', 'iloveapple2000')

    def test_toggle_subscription(self):
        url = reverse("subscription-list")
        data = {"subscriber": self.user1.id, "subscribed_to": self.user2.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_subscriptions(self):
        url = reverse("subscription-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_to_user_subscriptions(self):
        url = reverse("to_user-subscriptions", args=[self.user2.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_from_user_subscriptions(self):
        url = reverse("from_user-subscriptions", args=[self.user1.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
