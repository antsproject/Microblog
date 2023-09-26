from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from django.urls import path, re_path
from posts.views import PostView, CategoryView, LikeView, CategoryUpdateView, PostDetailView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="post_microservice",
        default_version='1.0',
        description="Documentation",
        contact=openapi.Contact(email="gofavalon@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
                  path('api/post/', PostView.as_view(), name='post-list-create'),
                  path('api/post/<int:pk>/', PostDetailView.as_view(), name='post-retrieve-update'),
                  path('api/category/', CategoryView.as_view(), name='category-list-create'),
                  path('api/category/<int:pk>/', CategoryUpdateView.as_view(), name='category-update'),
                  path('api/post/<int:post_id>/like/', LikeView.as_view(), name='like-post'),
                  path('api/post/<int:post_id>/likes/', LikeView.as_view(), name='post-likes'),

                  re_path(r'^swagger(?P<format>\.json|\.yaml)$',
                          schema_view.without_ui(cache_timeout=0), name='schema-json'),
                  path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
                       name='schema-swagger-ui'),
                  path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
                       name='schema-redoc'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
