from rest_framework import serializers
from .models import MessageToSupport, HelpArticle


class MessageSupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageToSupport
        fields = ('id', 'type', 'message', 'image', 'email', 'is_active', 'date_to_send')


class HelpArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpArticle
        fields = ('id', 'title', 'description')