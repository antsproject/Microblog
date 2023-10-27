from rest_framework import viewsets
from .models import ComplainPost, HelpArticle, Complain
from .serializers import ComplainSerializer, ComplainPostSerializer, HelpArticleSerializer
from rest_framework.response import Response
from rest_framework import status, pagination
from .user_permission import verify_token
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView


class HelpArticlesPagination(pagination.PageNumberPagination):
    page_size = 10


class HelpArticleViewSet(viewsets.ModelViewSet):
    queryset = HelpArticle.objects.all()
    serializer_class = HelpArticleSerializer
    pagination_class = HelpArticlesPagination

    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance:
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)


class HelpArticleByTitle(ListAPIView):
    serializer_class = HelpArticleSerializer

    def get_queryset(self):
        title = self.kwargs['title']
        return HelpArticle.objects.filter(title=title).order_by('-id')


class ComplainPostViewSet(viewsets.ModelViewSet):
    queryset = ComplainPost.objects.all().order_by('id')
    serializer_class = ComplainPostSerializer
    pagination_class = PageNumberPagination
    http_method_names = ['get', 'post', 'delete']
    
    def list(self, request, *args, **kwargs):
        # status_user = eval(request.headers['Issuperuser'].capitalize())
        # if status_user:
            return super().list(request, *args, **kwargs)
        # return Response({"error": "Complain not found"}, status=status.HTTP_400_BAD_REQUEST)
    

    def create(self, request, *args, **kwargs):
        data = request.data
        print(data)
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        status_user = eval(request.headers['Issuperuser'].capitalize())
        if status_user:
            instance = self.get_object()
            if instance:
                self.perform_destroy(instance)
                return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Complain not found"}, status=status.HTTP_400_BAD_REQUEST)


class ComplainPostViewSetByUserId(ListAPIView):
    queryset = ComplainPost.objects.all().order_by('id')
    serializer_class = ComplainPostSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return ComplainPost.objects.filter(user_id=user_id).order_by('-id')


class ComplainPostViewSetByPostId(ListAPIView):
    queryset = ComplainPost.objects.all().order_by('id')
    serializer_class = ComplainPostSerializer

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return ComplainPost.objects.filter(post_id=post_id).order_by('-id')

class ComplainPagination(pagination.PageNumberPagination):
    page_size = 20

class ComplainViewSet(viewsets.ModelViewSet):
    queryset = Complain.objects.all().order_by('id')
    serializer_class = ComplainSerializer
    pagination_class = ComplainPagination
    
    def create(self, request, *args, **kwargs):
        status_user = eval(request.headers['Issuperuser'].capitalize())
        if status_user:
            data = request.data
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        status_user = eval(request.headers['Issuperuser'].capitalize())
        if status_user:
            instance = self.get_object()
            if instance:
                serializer = self.get_serializer(instance, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
                return Response(serializer.data)
            else:
                return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        status_user = eval(request.headers['Issuperuser'].capitalize())
        if status_user:
            instance = self.get_object()
            if instance:
                self.perform_destroy(instance)
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "Complain not found"}, status=status.HTTP_404_NOT_FOUND)