from rest_framework import serializers, viewsets
from .models import PostModel, Tag


class TagSerializer(serializers.ModelSerializer):
    tag_name = serializers.CharField()

    def validate(self, data):
        tag_name = data.get("tag_name")

        if not Tag.objects.get(tag_name=tag_name):
            raise serializers.ValidationError(f"Invalid value for tag_name: {tag_name}")
        return data

    class Meta:
        model = Tag
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    # image = serializers.ImageField(required=False)
    tag = TagSerializer()

    # tag_name = serializers.CharField(max_length=50, default='Other')

    # content_preview = serializers.SerializerMethodField()

    class Meta:
        model = PostModel
        fields = (
            'user_id',
            'image',
            'tag',
            'title',
            'content',
            'updated_at',
            'created_at',
        )
        # fields = '__all__'

    # def get_content_preview(self, obj):
    #     return obj.get_content_preview()
