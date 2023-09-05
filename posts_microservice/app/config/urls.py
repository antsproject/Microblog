from rest_framework import routers, permissions
from django.contrib import admin
from django.urls import include, path, re_path
from posts.views import Posts, PostDetail
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="post_microservice",
        default_version='0.1',
        description="Documentation",
        contact=openapi.Contact(email="gofavalon@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/posts/', Posts.as_view()),
    path('api/posts/<str:pk>', PostDetail.as_view()),

    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
         name='schema-redoc'),
]
