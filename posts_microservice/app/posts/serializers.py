from rest_framework import serializers, viewsets
from .models import PostModel, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    tag = TagSerializer()
    # content_preview = serializers.SerializerMethodField()

    class Meta:
        model = PostModel
        fields = "__all__"

    # def get_content_preview(self, obj):
    #     return obj.get_content_preview()
