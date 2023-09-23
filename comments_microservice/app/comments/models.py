from django.db import models


class CommentModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    post_id = models.BigIntegerField(unique=True)
    username = models.CharField(max_length=64, unique=False)
    text_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "comments"
        ordering = ['-created_at']

