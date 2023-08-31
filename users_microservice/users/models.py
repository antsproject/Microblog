from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from uuid import uuid4


class CustomUserManager(BaseUserManager):

    def get_by_natural_key(self, username):
        return self.get(username=username)


class Users(AbstractBaseUser):
    id = models.UUIDField(default=uuid4, primary_key=True)
    username = models.CharField(max_length=64, unique=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    email = models.CharField(max_length=256, unique=True)
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    age = models.PositiveIntegerField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __dir__(self):
        return self.username



