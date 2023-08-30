from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from uuid import uuid4


class User(AbstractBaseUser):
    id = models.UUIDField(default=uuid4, primary_key=True)
    username = models.CharField(max_length=64)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    email = models.CharField(max_length=256, unique=True)
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    age = models.PositiveIntegerField(blank=True, null=True)

    def __dir__(self):
        return self.username

