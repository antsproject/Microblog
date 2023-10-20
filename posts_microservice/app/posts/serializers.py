from rest_framework import serializers

from config import settings
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
    category_id = serializers.IntegerField(required=True)
    # liked = serializers.BooleanField(default=False)
    # category = serializers.CharField(max_length=50, required=True)

    # REFORMAT DATE IN RESPONSE
    created_at_fmt = serializers.DateTimeField(
        format="%H:%M - %d.%m.%y",
        source="created_at",
        read_only=True
    )
    updated_at_fmt = serializers.DateTimeField(
        format="%H:%M - %d.%m.%y",
        source="created_at",
        read_only=True
    )

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
            'updated_at_fmt',
            'like_count',
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        current_user_id = self.context.get('current_user_id', None)

        if current_user_id:
            liked = LikeModel.objects.filter(user_id=current_user_id, post_id=instance.id).exists()
            ret['liked'] = liked

        request = self.context.get('request')

        if request:
            if instance.image:
                ret['image'] = instance.image.url

        return ret

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


class PostFilterSerializer(serializers.Serializer):
    user_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
