from rest_framework import serializers
from .models import CommentModel


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentModel
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

