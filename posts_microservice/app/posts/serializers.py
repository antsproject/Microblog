from rest_framework import serializers, viewsets
from .models import PostModel, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    tag = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all())

    class Meta:
        model = PostModel
        fields = "__all__"
