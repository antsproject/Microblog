from django.utils import timezone
from rest_framework import status, pagination
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework import viewsets, mixins

from .serializers import CommentSerializer, LikeSerializer
from .models import Comment, Like
from .tokenVerify import verify_token_user, verify_token_admin, verify_token_user_param


class CustomCommentsPagination(pagination.PageNumberPagination):
    page_size = 25


class CustomLikesPagination(pagination.PageNumberPagination):
    page_size = 100


class CommentModelViewSet(viewsets.GenericViewSet,
                          mixins.ListModelMixin,
                          mixins.CreateModelMixin,
                          mixins.RetrieveModelMixin,
                          mixins.UpdateModelMixin,
                          mixins.DestroyModelMixin):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    pagination_class = CustomCommentsPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        if not verify_token_user(request):
            return Response(
                {"status": "Fail",
                 "message": 'JWT USER TOKEN IS NOT VALID!'},
                status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "success",
                 "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {"status": "fail",
                 "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance)
        return Response(
            {"status": "success", "data": serializer.data},
            status=status.HTTP_200_OK
        )

    def update(self, request, *args, **kwargs):
        if not verify_token_user(request):
            return Response(
                {"status": "Fail",
                 "message": 'JWT USER TOKEN IS NOT VALID!'},
                status=status.HTTP_401_UNAUTHORIZED)
        instance = self.get_object()
        serializer = self.serializer_class(
            instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(updated_at=timezone.now())
            return Response(
                {"status": "success",
                 "data": serializer.data
                 })
        return Response(
            {"status": "fail",
             "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        comment_id = kwargs.get('pk')
        comment = get_object_or_404(Comment, id=comment_id)

        if not verify_token_user_param(request, comment.user_id) and not verify_token_admin(request):
            return Response(
                {"status": "Fail",
                 "message": 'JWT USER TOKEN IS NOT VALID!'},
                status=status.HTTP_401_UNAUTHORIZED)
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['GET'])
    def parents(self, request):
        queryset = self.get_queryset().filter(parent=None)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def children(self, request):
        parent_id = request.query_params.get('parent_id')
        queryset = self.get_queryset().filter(parent=parent_id)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['POST'], url_path='toggle-like')
    def toggle_like(self, request):
        if not verify_token_user(request):
            return Response(
                {"status": "Fail",
                 "message": 'JWT USER TOKEN IS NOT VALID!'},
                status=status.HTTP_401_UNAUTHORIZED)
        user_id = request.data.get('user_id')
        comment_id = request.data.get('comment_id')

        if not user_id or not comment_id:
            return Response(
                {"status": "fail",
                 "message": "Both 'user_id' and 'comment_id' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_id = int(user_id)
            comment_id = int(comment_id)
        except ValueError:
            return Response(
                {"status": "fail",
                 "message": "Invalid user_id or comment_id format."},
                status=status.HTTP_400_BAD_REQUEST
            )

        comment = Comment.objects.filter(id=comment_id).first()
        if not comment:
            return Response(
                {"status": "fail",
                 "message": "Comment not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        like, created = Like.objects.get_or_create(user_id=user_id, comment=comment)
        if created:
            liked = True
            message = "Like created successfully."
            comment.like_counter += 1
            comment.save()

        else:
            like.delete()
            liked = False
            message = "Like deleted successfully."
            comment.like_counter -= 1
            comment.save()

        return Response(
            {"status": "success",
             "message": message,
             "liked": liked},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['GET'], url_path='list-likes')
    def list_likes(self, request, pk=None):
        comment = self.get_object()

        likes = Like.objects.filter(comment=comment)

        likes_pagination = CustomLikesPagination()
        paginated_likes = likes_pagination.paginate_queryset(likes, request)

        serializer = LikeSerializer(paginated_likes, many=True)

        response = likes_pagination.get_paginated_response(serializer.data)

        return response

