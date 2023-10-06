
from django.contrib import admin
from django.urls import path, include, re_path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from comments.views import CommentModelViewSet
from rest_framework.routers import DefaultRouter

schema_view = get_schema_view(
    openapi.Info(
        title="comments_microservice",
        default_version='0.1',
        description="Documentation",
        contact=openapi.Contact(email="vetal1951@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router = DefaultRouter()
router.register(r'comments', CommentModelViewSet, basename='commentmodelviewset')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
         name='schema-redoc'),
]

