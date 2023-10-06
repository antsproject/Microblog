import json
import os

import requests
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from .models import PostModel, CategoryModel, LikeModel
from PIL import Image
from io import BytesIO


class BaseTestCase(APITestCase):

    def get_token(self):
        token_url = "http://127.0.0.1:8080/api/auth/token/"
        token_data = {
            "email": "mod@example.com",
            "password": "moderatorpassword"
        }
        headers = {
            "Content-Type": "application/json"
        }

        token_data_json = json.dumps(token_data)

        response = requests.post(token_url, data=token_data_json, headers=headers)
        response_json = response.json()

        jwt_token = response_json.get("access")
        return {'HTTP_AUTHORIZATION': f'Bearer {jwt_token}'}


class CategoryTestCase(BaseTestCase):
    def setUp(self):
        self.category_data = {
            "name": "Other"
        }
        self.category = CategoryModel.objects.create(**self.category_data)

        self.user_id = 2

        self.headers = self.get_token()

    def test_list_categories(self):
        url = reverse("category-list-create")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_category(self):
        url = reverse("category-list-create")

        new_category = {
            "name": "Science"
        }

        response = self.client.post(url, new_category, format="json", **self.headers)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_category(self):
        url = reverse("category-update", args=[self.category.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_picture_to_category(self):
        url = reverse("category-update", args=[self.category.id])

        image_content = BytesIO()
        image = Image.new('RGB', size=(50, 50), color=(0, 125, 125))
        image.save(image_content, 'png')
        image_content.seek(0)

        uploaded_file = SimpleUploadedFile(
            name='test_image.png',
            content=image_content.read(),
            content_type='image/png',
        )

        updated_data = {
            "user_id": self.user_id,
            "name": "Other",
            "image": uploaded_file,
        }

        response = self.client.patch(url, updated_data, format="multipart", **self.headers)

        os.remove(f"media/icons/{uploaded_file.name}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_category(self):
        url = reverse("category-update", args=[self.category.id])
        response = self.client.delete(url, **self.headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class PostTestCase(BaseTestCase):
    def setUp(self):

        self.user_id = 2

        self.category_data = {
            "name": "Other"
        }
        self.category = CategoryModel.objects.create(**self.category_data)

        self.post_data = {
            "category_id": self.category.id,
            "user_id": self.user_id,
            "title": "Test post",
            "content": {}
        }

        self.post = PostModel.objects.create(**self.post_data)

        self.headers = self.get_token()

    def test_list_posts(self):
        url = reverse("post-list-create")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_post(self):
        url = reverse("post-retrieve-update", args=[self.post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_post(self):
        url = reverse("post-list-create")

        new_post = {
            "category_id": self.category.id,
            "user_id": 2,
            "title": "Test post",
            "content": {}
        }

        response = self.client.post(url, new_post, format="json", **self.headers)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_add_picture_to_post(self):
        url = reverse("post-retrieve-update", args=[self.post.id])

        image_content = BytesIO()
        image = Image.new('RGB', size=(50, 50), color=(0, 125, 125))
        image.save(image_content, 'jpeg')
        image_content.seek(0)

        uploaded_file = SimpleUploadedFile(
            name='test_image.jpeg',
            content=image_content.read(),
            content_type='image/jpeg',
        )

        updated_data = {
            "user_id": self.user_id,
            "image": uploaded_file,
        }

        response = self.client.patch(url, updated_data, format="multipart", **self.headers)

        os.remove(f"media/static/{uploaded_file.name}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_post(self):
        updated_data = {
            "user_id": self.user_id,
            "title": "New title",
        }

        url = reverse("post-retrieve-update", args=[self.post.id])
        response = self.client.patch(url, updated_data, format="json", **self.headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_post(self):
        url = reverse("post-retrieve-update", args=[self.post.id])
        response = self.client.delete(url, **self.headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


# class LikeTestCase(APITestCase):
#     def setUp(self):
#         self.user = mixer.blend(User)
#         self.token = str(RefreshToken.for_user(self.user).access_token)
#         self.post = mixer.blend(PostModel)
#         self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
#
#     def test_like_view(self):
#         url = reverse('like-list')
#         data = {'user_id': self.user.id, 'post_id': self.post.id}
#         response = self.client.post(url, data)
#         assert response.status_code == 201