from rest_framework import serializers
from .models import PostModel, CategoryModel, LikeModel


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryModel
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):
    # REFORMAT DATE IN RESPONSE
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

    category = serializers.CharField(max_length=50, required=True)

    # REFORMAT DATE IN RESPONSE
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

    def validate_category(self, value):
        """
        Custom validation to check if the category exists.
        """
        try:
            return CategoryModel.objects.get(name=value)
        except CategoryModel.DoesNotExist as e:
            raise serializers.ValidationError(
                f"Category with name: '{value}' does not exist!")

    class Meta:
        model = PostModel
        fields = [
            'id',
            'user_id',
            'category',
            'title',
            'content',
            'image',
            'created_at_fmt',
            'updated_at_fmt'
        ]
