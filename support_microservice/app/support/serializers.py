from rest_framework import serializers
from .models import ComplainPost, HelpArticle, Complain


class ComplainPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplainPost
        fields = '__all__'


class ComplainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complain
        fields = '__all__'


class HelpArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpArticle
        fields = ('id', 'title', 'description')