from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from uuid import uuid4

from django.utils import timezone


class CustomUserManager(BaseUserManager):

    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_moderator(self, username, email, password=None):
        user = self.create_user(username, email, password)
        user.is_staff = True
        user.save(using=self._db)
        return user

    def get_by_natural_key(self, username):
        return self.get(username=username)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(default=uuid4, primary_key=True)
    username = models.CharField(max_length=64, unique=True)
    email = models.CharField(max_length=256, unique=True)
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    age = models.PositiveIntegerField(blank=True, null=True)

    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    groups = models.ManyToManyField(
        'auth.Group',
        blank=True,
        related_name='custom_user_set',
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        blank=True,
        related_name='custom_user_set',
        related_query_name='custom_user',
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __dir__(self):
        return self.username



