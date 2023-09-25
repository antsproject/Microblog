from django.db import models


class CategoryModel(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=50, unique=True)
    image = models.ImageField(upload_to='category_icons/',
                              null=True, blank=True)

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
    image = models.ImageField(upload_to='post_images/',
                              null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class LikeModel(models.Model):
    user_id = models.BigIntegerField()
    post_id = models.ForeignKey(PostModel,
                                on_delete=models.CASCADE,
                                to_field='id')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user_id', 'post_id')
