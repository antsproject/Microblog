import requests
import json

from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from .serializers import LikeSerializer
from .models import Comment, Like


class CommentModelViewSetTestCase(APITestCase):
    def setUp(self):
        self.comment_data = {
            "post_id": 1,
            "user_id": 2,
            "text_content": "Test comment"
        }
        self.comment = Comment.objects.create(**self.comment_data)
        self.user_id = 2  # Замените на нужный вам user_id

        # Выполняем POST запрос для получения JWT-токена
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

        self.jwt_token = response_json.get("access")
        self.headers = {'HTTP_AUTHORIZATION': f'Bearer {self.jwt_token}'}

    def test_create_comment(self):
        url = reverse("commentmodelviewset-list")

        data_with_parent = {
            "post_id": 1,
            "user_id": 2,
            "text_content": "Test Comment",
            "parent": None
        }

        response = self.client.post(url, data_with_parent, format="json", **self.headers)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        created_comment = Comment.objects.get(id=response.data["data"]["id"])
        if "parent" in data_with_parent and data_with_parent["parent"] is not None:
            self.assertEqual(created_comment.parent_id, data_with_parent["parent"])
        else:
            self.assertIsNone(created_comment.parent_id)

    def test_list_comments(self):
        url = reverse("commentmodelviewset-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_comment(self):
        url = reverse("commentmodelviewset-detail", args=[self.comment.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_comment(self):
        updated_data = {
            "user_id": 2,
            "text_content": "Updated comment"
        }
        url = reverse("commentmodelviewset-detail", args=[self.comment.id])
        response = self.client.patch(url, updated_data, format="json", **self.headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_comment(self):
        url = reverse("commentmodelviewset-detail", args=[self.comment.id])
        response = self.client.delete(url, format="json", **self.headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class LikesTests(APITestCase):
    def setUp(self):
        self.comment = Comment.objects.create(post_id=1, user_id=2, text_content="Test Comment")
        self.like1 = Like.objects.create(user_id=2, comment=self.comment)

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

        self.jwt_token = response_json.get("access")
        self.headers = {'HTTP_AUTHORIZATION': f'Bearer {self.jwt_token}'}

    def test_list_likes(self):
        url = reverse("commentmodelviewset-list-likes", args=[self.comment.id])

        expected_likes = [
            {"id": 1, "user_id": 2, "comment_id": self.comment.id},
        ]

        response = self.client.get(url, format="json")
        response_data = response.data.get("results", [])

        response_data_list = [
            dict(item) for item in response_data
        ]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data_list, expected_likes)

    def test_toggle_like_success(self):
        comment = Comment.objects.create(
            post_id=1, user_id=2, text_content="Test Comment"
        )

        user_id = 2
        comment_id = comment.id

        url = reverse("commentmodelviewset-toggle-like")
        data = {"user_id": user_id, "comment_id": comment_id}
        response = self.client.post(url, data, format="json", **self.headers)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "status": "success",
            "message": "Like created successfully.",
            "liked": True,
        })

        like = Like.objects.filter(user_id=user_id, comment=comment).first()
        self.assertIsNotNone(like)

        response = self.client.post(url, data, format="json", **self.headers)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "status": "success",
            "message": "Like deleted successfully.",
            "liked": False,
        })

        like = Like.objects.filter(user_id=user_id, comment=comment).first()
        self.assertIsNone(like)
