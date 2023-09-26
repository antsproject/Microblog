from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateAPIView, get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import PostModel, CategoryModel, LikeModel
from .serializers import PostSerializer, CategorySerializer, LikeSerializer

# TOKEN VERIFY IMPORT (1/3)
from .tokenVerify import verify_token_user, verify_token_admin
from rest_framework.permissions import IsAuthenticated


class PostView(CreateAPIView, ListAPIView):
    # TOKEN VERIFY PERMISSIONS (2/3)
    # permission_classes = [IsAuthenticated]

    queryset = PostModel.objects.all().order_by('id')
    serializer_class = PostSerializer

    def post(self, request, *args, **kwargs):
        # TOKEN VERIFY FUNCTIONS (3/3)
        # if not verify_token_user(request):
        #     return Response(
        #         {"status": "Fail",
        #          "message": 'JWT USER TOKEN IS NOT VALID!'},
        #         status=status.HTTP_401_UNAUTHORIZED)
        # if not verify_token_admin(request):
        #     return Response(
        #         {"status": "Fail",
        #          "message": 'JWT ADMIN TOKEN IS NOT VALID!'},
        #         status=status.HTTP_401_UNAUTHORIZED)

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


class CategoryUpdateView(RetrieveUpdateAPIView):
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


class LikeView(CreateAPIView, ListAPIView):
    queryset = LikeModel.objects.all().order_by('post_id')
    serializer_class = LikeSerializer

    def create(self, request, *args, **kwargs):
        post_id = kwargs.get('post_id')
        user_id = request.data['user_id']
        existing_like = LikeModel.objects.filter(user_id=user_id, post_id=post_id).first()

        if existing_like:
            return Response(
                {"status": "Fail",
                 "message": "You have already liked this post!"},
                status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "Success",
                 "message": "Post liked successfully."},
                status=status.HTTP_201_CREATED)
        return Response(
            {"status": "Fail",
             "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return LikeModel.objects.filter(post_id=post_id)
