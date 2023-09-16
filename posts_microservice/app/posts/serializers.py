from rest_framework import serializers, viewsets
from .models import PostModel, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = PostModel
        fields = "__all__"
