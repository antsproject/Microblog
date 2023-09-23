import json
import math
import jwt
from datetime import datetime

from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status, generics, viewsets
from rest_framework.views import APIView

from .user_permission import verify_token_user, verify_token_admin
from .models import PostModel, Tag
from .serializers import PostSerializer, TagSerializer


class Posts(generics.GenericAPIView):
    serializer_class = PostSerializer
    queryset = PostModel.objects.all()

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        image = request.data.get('image', None)

        # if not verify_token_user(request_data):
        #     return Response(
        #         {"status": "fail",
        #          "message": "Token is not valid"},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            title = serializer.validated_data['title']
            content = serializer.validated_data['content']
            tag_data = serializer.validated_data['tag']
            tag_instance, created = Tag.objects.get_or_create(**tag_data)

            post = PostModel.objects.create(
                user_id=user_id,
                title=title,
                content=content,
                tag=tag_instance
            )

            if image:
                post.image = image
                post.save()

            post.save()

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

        posts = PostModel.objects.all()
        total_posts = posts.count()

        if search_param:
            posts = posts.filter(title__icontains=search_param)
        serializer = self.serializer_class(posts[start_num:end_num],
                                           many=True)

        serializer = self.serializer_class(
            posts[start_num:end_num],
            many=True,
            context={'request': request}
        )

        return Response({
            "status": "success",
            "total": total_posts,
            "page": page_num,
            "last_page": math.ceil(total_posts / limit_num),
            "posts": serializer.data
        })


class PostDetail(generics.GenericAPIView):
    queryset = PostModel.objects.all()
    serializer_class = PostSerializer

    def get_post(self, pk):
        try:
            return PostModel.objects.get(pk=pk)
        except:
            return None

    def get(self, request, pk):
        post = self.get_post(pk=pk)
        if post is None:
            return Response(
                {"status": "fail",
                 "message": f"Post with Id: {pk} not found"},
                status=status.HTTP_404_NOT_FOUND)
        elif post.is_deleted:
            return Response(
                {"status": "fail",
                 "message": f"Post with Id: {pk} DELETED"},
                status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(post)
        return Response(
            {"status": "success",
             "data": {"post": serializer.data}
             })

    def patch(self, request, pk):
        post = self.get_post(pk)
        if post is None:
            return Response(
                {"status": "fail",
                 "message": f"Post with Id: {pk} not found"},
                status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(
            post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.validated_data['updated_at'] = datetime.now()
            serializer.save()
            return Response(
                {"status": "success",
                 "data": {"post": serializer.data}
                 })
        return Response(
            {"status": "fail",
             "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        post = self.get_post(pk)
        if post is None:
            return Response(
                {"status": "fail",
                 "message": f"Post with Id: {pk} not found"},
                status=status.HTTP_404_NOT_FOUND)

        post.is_deleted = True
        post.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


# class PostContentPreview(APIView):
#     def get(self, request, pk):
#         post = PostModel.objects.get(pk=pk)
#         serializer = PostSerializer(post)
#         return Response(serializer.data['content_preview'])
