from rest_framework import serializers
from .models import ComplainPost, HelpArticle, Complain


class ComplainPostSerializer(serializers.ModelSerializer):
    date_to_send = serializers.DateTimeField(
        format="%H:%M - %d.%m.%y",
        read_only=True
    )

    class Meta:
        model = ComplainPost
        fields = ('id', 'email', 'user_id', 'post_id', 'date_to_send', 'is_active', 'complain_types')


class ComplainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complain
        fields = '__all__'


class HelpArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpArticle
        fields = ('id', 'title', 'description')
