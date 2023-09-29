from rest_framework import serializers
from .models import Comment, Like


class CommentSerializer(serializers.ModelSerializer):
    like_counter = serializers.ReadOnlyField()

    class Meta:
        model = Comment
        fields = "__all__"

    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #
    #     # Если комментарий является родительским (поле parent пустое)
    #     if instance.parent is None:
    #         data['replies'] = list(instance.replies.all().values_list('id', flat=True))
    #     else:
    #         data.pop('replies', None)

        # return data


class LikeSerializer(serializers.ModelSerializer):
    comment_id = serializers.IntegerField(source='comment.id')

    class Meta:
        model = Like
        fields = ('id', 'user_id', 'comment_id')
