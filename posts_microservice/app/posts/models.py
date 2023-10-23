from django.db import models
from django_resized import ResizedImageField


class CategoryModel(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=50, unique=True)
    image = ResizedImageField(size=[48, 48], force_format='PNG', quality=100,
                              upload_to='icons/', null=True, blank=True)

    def __str__(self):
        return self.name


class PostModel(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False)
    user_id = models.BigIntegerField()

    category = models.ForeignKey(CategoryModel,
                                 on_delete=models.CASCADE,
                                 to_field='id')

    title = models.CharField(max_length=255)
    content = models.JSONField()
    image = ResizedImageField(size=[2048, 1080], force_format='JPEG', quality=100,
                              upload_to='static/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    like_count = models.IntegerField(default=0)

    def __str__(self):
        return self.title


class LikeModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_id = models.BigIntegerField()
    post_id = models.ForeignKey(PostModel,
                                on_delete=models.CASCADE,
                                to_field='id')
    created_at = models.DateTimeField(auto_now_add=True)


class FavoriteModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_id = models.BigIntegerField()
    post_id = models.ForeignKey(PostModel,
                                on_delete=models.CASCADE,
                                to_field='id')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user_id', 'post_id')
