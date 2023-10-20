import uuid

from django.db import models


class Complain(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    type = models.CharField(max_length=128, unique=True)


class ComplainPost(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    email = models.EmailField(max_length=256, unique=False)
    is_active = models.BooleanField(default=True)
    date_to_send = models.DateTimeField(auto_now_add=True)
    user_id = models.BigIntegerField()
    post_id = models.BigIntegerField()
    complain_type = models.ForeignKey(Complain, on_delete=models.CASCADE)


class HelpArticle(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    title = models.CharField(max_length=256, unique=True)
    description = models.TextField()
