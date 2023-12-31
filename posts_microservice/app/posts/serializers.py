from rest_framework import serializers
from .models import PostModel, CategoryModel, LikeModel


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryModel
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):
    created_at_fmt = serializers.DateTimeField(
        format="%H:%M %Y-%m-%d",
        source="created_at",
        read_only=True
    )

    class Meta:
        model = LikeModel
        fields = ['user_id',
                  'post_id',
                  'created_at_fmt'
                  ]


class PostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False)
    category_id = serializers.IntegerField(required=True)

    created_at_fmt = serializers.DateTimeField(
        format="%H:%M %Y-%m-%d",
        source="created_at",
        read_only=True
    )
    updated_at_fmt = serializers.DateTimeField(
        format="%H:%M %Y-%m-%d",
        source="created_at",
        read_only=True
    )

    def create(self, validated_data):
        """
        Custom validation to check if the category exists.
        """
        category_id = validated_data.pop('category_id')

        try:
            category = CategoryModel.objects.get(id=category_id)
        except CategoryModel.DoesNotExist:
            raise serializers.ValidationError(f"Category with ID {category_id} does not exist!")

        post = PostModel.objects.create(category=category, **validated_data)

        return post

    class Meta:
        model = PostModel
        fields = [
            'id',
            'user_id',
            'category_id',
            'title',
            'content',
            'image',
            'created_at_fmt',
            'updated_at_fmt'
        ]
