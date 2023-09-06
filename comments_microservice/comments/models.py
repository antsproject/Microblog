from django.db import models
from users_microservice.app.users.models import CustomUser
from posts_microservice.app.posts.models import PostModel

class Comment(models.Model):
    post = models.ForeignKey(PostModel, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
