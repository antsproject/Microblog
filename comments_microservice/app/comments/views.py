from django.utils import timezone
from django.http import Http404
from rest_framework import status, generics, pagination
from rest_framework.response import Response

from .serializers import CommentSerializer
from .models import CommentModel
from .user_permission import verify_token


class CustomCommentsPagination(pagination.PageNumberPagination):
    page_size = 100


class Comments(generics.ListCreateAPIView):
    queryset = CommentModel.objects.all()
    serializer_class = CommentSerializer
    pagination_class = CustomCommentsPagination

    def post(self, request, *args, **kwargs):
        request_data = request.data
        serializer = self.serializer_class(data=request.data)

        # if not verify_token(request_data):
        #     return Response(
        #         {"status": "fail",
        #          "message": "Token is not valid"},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

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

    def get(self, request, *args, **kwargs):

        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommentModel.objects.all()
    serializer_class = CommentSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')
        try:
            return CommentModel.objects.get(pk=pk)
        except CommentModel.DoesNotExist:
            raise Http404

    def get(self, request, *args, **kwargs):
        comment = self.get_object()
        serializer = self.serializer_class(comment)
        return Response(
            {"status": "success", "data": {"comment": serializer.data}},
            status=status.HTTP_200_OK
        )

    def patch(self, request, *args, **kwargs):
        comment = self.get_object()
        serializer = self.serializer_class(
            comment, data=request.data, partial=True)
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

    def delete(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment is None:
            return Response(
                {"status": "fail",
                 "message": f"Comment not found"},
                status=status.HTTP_404_NOT_FOUND)

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
