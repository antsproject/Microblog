from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateAPIView, get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status, pagination
from django.http import Http404
from rest_framework.views import APIView

from .models import PostModel, CategoryModel, LikeModel
from .serializers import PostSerializer, CategorySerializer, LikeSerializer, PostFilterSerializer
from .tokenVerify import verify_token_user, verify_token_admin, verify_token_user_param


class PostsPagination(pagination.PageNumberPagination):
    page_size = 20


class LikesPagination(pagination.PageNumberPagination):
    page_size = 100


class PostView(CreateAPIView, ListAPIView):
    queryset = PostModel.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostsPagination

    def post(self, request, *args, **kwargs):
        if not verify_token_user(request):
            return Response(
                {"status": "Fail",
                 "message": 'JWT USER TOKEN IS NOT VALID!'},
                status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "Success",
                 "data": {"post": serializer.data}},
                status=status.HTTP_201_CREATED)
        return Response(
            {"status": "Fail",
             "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return PostModel.objects.filter(is_deleted=False).order_by('-id')


class PostDetailView(RetrieveUpdateDestroyAPIView):
    queryset = PostModel.objects.all().order_by('id')
    serializer_class = PostSerializer

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs['pk']
        try:
            instance = get_object_or_404(self.queryset, pk=pk)
            if instance.is_deleted:
                return Response(
                    {"status": "Fail",
                     "message": f"Post with Id: {pk} not found"},
                    status=status.HTTP_404_NOT_FOUND)

            serializer = self.get_serializer(instance)

            return Response(
                {"status": "Success",
                 "data": {"post": serializer.data}},
                status=status.HTTP_200_OK)

        except Http404:
            return Response(
                {"status": "Fail",
                 "message": f"Post with Id: {pk} not found"},
                status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        if not verify_token_user(request):
            return Response(
                {"status": "Fail",
                 "message": 'JWT USER TOKEN IS NOT VALID!'},
                status=status.HTTP_401_UNAUTHORIZED)

        pk = kwargs['pk']
        try:
            instance = get_object_or_404(self.queryset, pk=pk)
            serializer = self.get_serializer(instance,
                                             data=request.data,
                                             partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"status": "Success",
                     "new_data": {"post": serializer.data}},
                    status=status.HTTP_200_OK)
            return Response(
                {"status": "Fail",
                 "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response(
                {"status": "Fail",
                 "message": f"Post with Id: {pk} not found"},
                status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        pk = kwargs['pk']
        post_object = get_object_or_404(self.queryset, pk=pk)
        if not verify_token_user_param(request, post_object.user_id) and not verify_token_admin(request):
            return Response(
                {"status": "Fail",
                 "message": 'JWT USER TOKEN IS NOT VALID!'},
                status=status.HTTP_401_UNAUTHORIZED)

        try:
            instance = get_object_or_404(self.queryset, pk=pk)
            instance.is_deleted = True
            instance.save()

            return Response(
                {"status": "Success",
                 "message": f"Post with Id: {pk} marked as deleted"},
                status=status.HTTP_200_OK)
        except Http404:
            return Response(
                {"status": "Fail",
                 "message": f"Post with Id: {pk} not found"},
                status=status.HTTP_404_NOT_FOUND)


class PostsFromUserView(ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return PostModel.objects.filter(user_id=user_id, is_deleted=False).order_by('-id')


class PostFilterView(APIView):
    def post(self, request, format=None):
        serializer = PostFilterSerializer(data=request.data)

        if serializer.is_valid():
            user_ids = serializer.validated_data.get('user_ids', [])

            if user_ids:
                queryset = PostModel.objects.filter(user_id__in=user_ids)
            else:
                queryset = PostModel.objects.all()

            pagination = PostsPagination()
            context = pagination.paginate_queryset(queryset, request)
            serializer = PostSerializer(
                context, many=True
            )

            return pagination.get_paginated_response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryView(ListCreateAPIView):
    queryset = CategoryModel.objects.all().order_by('id')
    serializer_class = CategorySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "Success",
                 "data": {"category": serializer.data}},
                status=status.HTTP_201_CREATED)
        return Response(
            {"status": "Fail",
             "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)


class CategoryUpdateView(RetrieveUpdateAPIView, DestroyAPIView):
    queryset = CategoryModel.objects.all().order_by('id')
    serializer_class = CategorySerializer

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs['pk']
        try:
            instance = get_object_or_404(self.queryset, pk=pk)
            serializer = self.get_serializer(instance)

            return Response(
                {"status": "Success",
                 "data": {"post": serializer.data}},
                status=status.HTTP_200_OK)
        except Http404:
            return Response(
                {"status": "Fail",
                 "message": f"Category with Id: {pk} not found"},
                status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        pk = kwargs['pk']
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data)
            if serializer.is_valid():
                serializer.save()

                return Response(
                    {"status": "Success",
                     "data": {"category": serializer.data}},
                    status=status.HTTP_200_OK)
            return Response(
                {"status": "Fail",
                 "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response(
                {"status": "Fail",
                 "message": f"Category with Id: {pk} not found"},
                status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        if not verify_token_admin(request):
            return Response(
                {"status": "Fail",
                 "message": 'JWT USER TOKEN IS NOT VALID!'},
                status=status.HTTP_401_UNAUTHORIZED)

        pk = kwargs['pk']
        try:
            instance = get_object_or_404(self.queryset, pk=pk)

            return Response(
                {"status": "Success",
                 "message": {"Delete": f'Category with Id: {pk} and name: "{instance.name}" is deleted'}},
                status=status.HTTP_200_OK)
        except Http404:
            return Response(
                {"status": "Fail",
                 "message": f"Category with Id: {pk} not found"},
                status=status.HTTP_404_NOT_FOUND)


class LikeView(CreateAPIView, DestroyAPIView):
    queryset = LikeModel.objects.all().order_by('post_id')
    serializer_class = LikeSerializer

    def create(self, request, *args, **kwargs):
        post_id = request.data['post_id']
        user_id = request.data['user_id']
        existing_like = LikeModel.objects.filter(user_id=user_id, post_id=post_id).first()

        if existing_like:
            existing_like.delete()
            return Response(
                {"status": "Success",
                 "message": f"Post {post_id} unliked successfully by User: {user_id}."},
                status=status.HTTP_200_OK)
        else:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"status": "Success",
                     "message": f"Post {post_id} liked successfully by User: {user_id}."},
                    status=status.HTTP_201_CREATED)
            return Response(
                {"status": "Fail",
                 "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST)


class PostLikesView(ListAPIView):
    queryset = LikeModel.objects.all().order_by('post_id')
    serializer_class = LikeSerializer
    pagination_class = LikesPagination

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return LikeModel.objects.filter(post_id=post_id)


class UserLikesView(ListAPIView):
    queryset = LikeModel.objects.all().order_by('user_id')
    serializer_class = LikeSerializer
    pagination_class = LikesPagination

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return LikeModel.objects.filter(user_id=user_id)
