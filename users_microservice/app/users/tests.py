from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory, force_authenticate, APIClient
from rest_framework import status
from .models import CustomUser
from .views import UserViewSet


class UsersTests(APITestCase):

    def setUp(self) -> None:
        # Тестовый Пользователь и модератор
        self.user = CustomUser.objects.create_user(username='testuser', email='testuser@gmail.com')
        self.moderator = CustomUser.objects.create_moderator(username='testmoderator', email='testmoderator@gmail.com')

        # Тестовые данные для запроса
        self.test_user_data = {
            "username": "test_user",
            "email": "testUser@gmail.com",
            "first_name": "User",
            "last_name": "Test",
            "password1": "test_user_password123",
            "password2": "test_user_password123"
        }

    def test_get_list_guest(self):
        """
        Тест запроса на список пользователей от пользователя
        :return:
        """
        factory = APIRequestFactory()
        request = factory.get('/api/users/')
        view = UserViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        """
        Тест запроса на создание пользователя от пользователя
        :return:
        """
        factory = APIRequestFactory()
        request = factory.post('/api/users/', self.test_user_data)
        view = UserViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_user(self):
        """
        Тест запроса для Редактирования записи о пользователе от пользователя
        :return:
        """
        factory = APIRequestFactory()
        request = factory.post(f'/api/users/{self.user.id}/', self.test_user_data)
        view = UserViewSet.as_view({'post': 'update'})
        response = view(request, pk=self.user.id)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_user_moder(self):
        """
        Тест запроса для Редактирования записи о пользователе от Модератора
        :return:
        """
        factory = APIRequestFactory()
        request = factory.post(f'/api/users/{self.user.id}/', self.test_user_data)
        force_authenticate(request, user=self.moderator)
        view = UserViewSet.as_view({'post': 'update'})
        response = view(request, pk=self.user.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_user(self):
        """
        Тест запроса на удаление пользователя от пользователя
        :return:
        """
        factory = APIRequestFactory()
        request = factory.delete(f'/api/users/{self.user.id}/', self.test_user_data)
        view = UserViewSet.as_view({'delete': 'destroy'})
        response = view(request, pk=self.user.id)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_user_moder(self):
        """
        Тест запроса на удаление пользователя от Модератора
        :return:
        """
        factory = APIRequestFactory()
        request = factory.delete(f'/api/users/{self.user.id}/', self.test_user_data)
        force_authenticate(request, user=self.moderator)
        view = UserViewSet.as_view({'delete': 'destroy'})
        response = view(request, pk=self.user.id)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    