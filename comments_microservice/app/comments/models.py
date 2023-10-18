from django.db import models


class Comment(models.Model):
    id = models.BigAutoField(primary_key=True)
    post_id = models.BigIntegerField(unique=False, null=False, blank=False)
    parent = models.ForeignKey('self', null=True, blank=True,
                               on_delete=models.CASCADE, related_name='replies')
    user_id = models.BigIntegerField(unique=False, null=False, blank=False)
    like_counter = models.PositiveIntegerField(default=0)
    children_counter = models.PositiveIntegerField(default=0)
    text_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "comments"
        ordering = ['-created_at']


class Like(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_id = models.BigIntegerField(unique=False, null=False, blank=False)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)

    class Meta:
        db_table = "likes"
        unique_together = ['user_id', 'comment_id']

