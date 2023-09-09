from rest_framework import viewsets
from .models import MessageToSupport, HelpArticle
from .serializers import MessageSupportSerializer, HelpArticleSerializer
from rest_framework.response import Response
from rest_framework import status
from .user_permission import verify_token


class HelpArticleViewSet(viewsets.ModelViewSet):
    queryset = HelpArticle.objects.all()
    serializer_class = HelpArticleSerializer

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


class MessageToSupportViewSet(viewsets.ModelViewSet):
    queryset = MessageToSupport.objects.all()
    serializer_class = MessageSupportSerializer
    http_method_names = ['get', 'post', 'delete']

    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)