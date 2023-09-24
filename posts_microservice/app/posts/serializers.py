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
    tag = serializers.CharField(max_length=50, required=True)

    class Meta:
        model = PostModel
        fields = '__all__'

    def validate_tag(self, value):
        if value not in [tag.tag_name for tag in Tag.objects.all()]:
            raise serializers.ValidationError("Invalid value for tag.")
        return value

    def create(self, validated_data):
        tag_name = validated_data.pop('tag', 'Other')
        tag, _ = Tag.objects.get_or_create(tag_name=tag_name)
        validated_data['tag'] = tag
        post = super().create(validated_data)
        return post

    def update(self, instance, validated_data):
        tag_name = validated_data.pop('tag', instance.tag.tag_name)
        tag, _ = Tag.objects.get_or_create(tag_name=tag_name)
        instance.tag = tag
        instance.save()
        return super().update(instance, validated_data)
