from django.db import models
from uuid import uuid4


class PostModel(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    username = models.CharField(max_length=64, unique=True)
    title = models.CharField(max_length=255, unique=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "posts"
        ordering = ['-created_at']

        def __str__(self) -> str:
            return self.title
