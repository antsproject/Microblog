from django.db import models
from uuid import uuid4


class Tag(models.Model):
    FIXED_VALUES = [
        'Science',
        'Money',
        'Life',
        'Other'
    ]

    tag_name = models.CharField(max_length=50, default='Other')
    tag_image = models.ImageField(upload_to='tag_images/', null=True, blank=True)

    def __str__(self):
        return self.tag_name

    def save(self, *args, **kwargs):
        if self.tag_name not in self.FIXED_VALUES:
            raise ValueError(f"Invalid value for tag_name: {self.tag_name}")
        super().save(*args, **kwargs)


class PostModel(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False)
    # id = models.UUIDField(default=uuid4, primary_key=True, editable=False)

    user_id = models.BigIntegerField()
    # username = models.CharField(max_length=64, unique=False)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    title = models.CharField(max_length=255, unique=True)
    content = models.TextField()
    # content_preview = models.TextField(max_length=300, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    is_deleted = models.BooleanField(default=False, editable=False)

    def __str__(self) -> str:
        return self.title

    def get_content_preview(self, length=300):
        if len(self.content) <= length:
            return self.content
        else:
            return f"{self.content[:length]}..."
