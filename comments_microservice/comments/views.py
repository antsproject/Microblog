import math
from datetime import datetime

from rest_framework import status, generics
from rest_framework.response import Response

from .serializers import CommentSerializer
from .models import CommentModel
from .user_permission import verify_token


class Comments(generics.GenericAPIView):
    serializer_class = CommentSerializer
    queryset = CommentModel.objects.all()

    def post(self, request):
        request_data = request.data
        serializer = self.serializer_class(data=request.data)

        if not verify_token(request_data):
            return Response(
                {"status": "fail",
                 "message": "Token is not valid"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if serializer.is_valid():
            username = serializer.validated_data['username']
            content = serializer.validated_data['content']
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

    def get(self, request):
        page_num = int(request.GET.get("page", 1))
        limit_num = int(request.GET.get("limit", 10))
        start_num = (page_num - 1) * limit_num
        end_num = limit_num * page_num

        search_param = request.GET.get("search")

        comments = CommentModel.objects.all()
        total_comments = comments.count()

        if search_param:
            comment = comments.filter(title__icontains=search_param)
        serializer = self.serializer_class(comments[start_num:end_num],
                                           many=True)
        return Response({
            "status": "success",
            "total": total_comments,
            "page": page_num,
            "last_page": math.ceil(total_comments / limit_num),
            "comments": serializer.data
        })
