from django.utils import timezone
from rest_framework import status, generics, pagination
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, mixins

from .serializers import CommentSerializer
from .models import CommentModel
from .user_permission import verify_token


class CustomCommentsPagination(pagination.PageNumberPagination):
    page_size = 25


class CommentModelViewSet(viewsets.GenericViewSet,
                          mixins.ListModelMixin,
                          mixins.CreateModelMixin,
                          mixins.RetrieveModelMixin,
                          mixins.UpdateModelMixin,
                          mixins.DestroyModelMixin):
    queryset = CommentModel.objects.all()
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
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "success",
                 "data": {"post": serializer.data}},
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
            {"status": "success", "data": {"comment": serializer.data}},
            status=status.HTTP_200_OK
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(
            instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(updated_at=timezone.now())
            return Response(
                {"status": "success",
                 "data": {"comment": serializer.data}
                 })
        return Response(
            {"status": "fail",
             "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
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


