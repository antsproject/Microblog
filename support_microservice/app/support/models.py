import uuid

from django.db import models


class MessageToSupport(models.Model):
    TYPE_MESSAGE = [
        ('Spam', 'Спам'),
        ('Affront', 'Оскорбление'),
        ('Law violation', 'Нарушение закона'),
        ('Pornographic content', 'Порнографический контент'),
        ('Violence', 'Насилие'),
        ('Copyright', 'Авторские права'),
        ('Other', 'Другое'),
    ]
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    type = models.CharField(max_length=64, choices=TYPE_MESSAGE)
    message = models.TextField(blank=True)
    email = models.EmailField(max_length=256, unique=True)
    date_to_send = models.DateTimeField(auto_now_add=True)


class HelpArticle(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    title = models.CharField(max_length=256, unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='images/', blank=True, null=True)