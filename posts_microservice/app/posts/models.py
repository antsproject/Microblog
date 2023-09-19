from django.db import models
from uuid import uuid4


class Tag(models.Model):
    SCIENCE = 'Science'
    MONEY = 'Money'
    LIFE = 'Life'
    OTHER = 'Other'

    TAG_CHOICES = [
        (SCIENCE, 'Science'),
        (MONEY, 'Money'),
        (LIFE, 'Life'),
        (OTHER, 'Other'),
    ]

    tag_name = models.CharField(max_length=50, choices=TAG_CHOICES)

    def __str__(self):
        return self.tag_name


class PostModel(models.Model):
    # id = models.BigAutoField(primary_key=True, editable=False)
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    username = models.CharField(max_length=64, unique=False)
    title = models.CharField(max_length=255, unique=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False, editable=False)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        db_table = "posts"
        ordering = ['-created_at']

        def __str__(self) -> str:
            return self.title
