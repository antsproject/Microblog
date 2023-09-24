from autoslug import AutoSlugField
from django.db import models
from uuid import uuid4


class Tag(models.Model):
    tag_name = models.CharField(max_length=50, default='Other', unique=True)
    tag_image = models.ImageField(upload_to='tag_images/', null=True, blank=True)

    def __str__(self):
        return self.tag_name


class PostModel(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False)
    user_id = models.BigIntegerField()

    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='post_images/',
                              null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    is_deleted = models.BooleanField(default=False, editable=False)

    # def get_content_preview(self, length=300):
    #     if len(self.content) <= length:
    #         return self.content
    #     else:
    #         return f"{self.content[:length]}..."

    def __str__(self) -> str:
        return self.title
