from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.text import slugify
from django_resized import ResizedImageField
from django.db.models.signals import pre_save
from django.dispatch import receiver

from django.utils import timezone
from pytils.translit import translify


class CustomUserManager(BaseUserManager):

    def create_user(self, username, email, password=None, is_active=False):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email)
        user.set_password(password)
        user.slug = self._create_unique_slug(user, user.username)
        user.is_active = is_active
        user.save(using=self._db)
        return user

    def create_moderator(self, username, email, password=None):
        user = self.create_user(username, email, password)
        user.is_staff = True
        user.is_active = True
        user.slug = self._create_unique_slug(user, user.username)
        user.save(using=self._db)
        return user

    def create_admin(self, username, email, password=None):
        user = self.create_user(username, email, password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.slug = self._create_unique_slug(user, user.username)
        user.save(using=self._db)
        return user

    def _create_unique_slug(self, instance, username):
        """
        Создает уникальный slug, добавляя числовой суффикс, если слаг уже существует.
        """
        transliterated_username = translify(username)
        slug = slugify(transliterated_username, allow_unicode=False)

        return slug


class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=64)
    email = models.EmailField(max_length=256, unique=True)
    status = models.CharField(max_length=300, blank=True)
    slug = models.SlugField(max_length=255, blank=True, editable=True)
    avatar = ResizedImageField(size=[300, 300], quality=100, upload_to='avatars/', force_format='JPEG',
                               default='avatars/default_avatar.jpg', null=True, blank=True)

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

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', ]

    def __str__(self):
        return self.username


@receiver(pre_save, sender=CustomUser)
def update_user_slug(sender, instance, **kwargs):
    instance.slug = CustomUser.objects._create_unique_slug(instance, instance.username)


class Subscription(models.Model):
    id = models.BigAutoField(primary_key=True)
    subscriber = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='subscriptions')
    subscribed_to = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='subscribers')
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('subscriber', 'subscribed_to')

    def __str__(self):
        return f'{self.subscriber.username} -> {self.subscribed_to.username}'


class ActivationToken(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=128, unique=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.token} {self.user}'

