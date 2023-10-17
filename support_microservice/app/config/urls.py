"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from support import views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions, routers

schema_view = get_schema_view(
    openapi.Info(
        title='support_microserviced',
        default_version='0.1',
        description='Documentation to out project',
        contact=openapi.Contact(email='gtoll@yandex.ru'),
        license=openapi.License(name='MIT License')

    ),
    public=True,
    permission_classes=[permissions.AllowAny]
)

router = routers.DefaultRouter()
router.register('help', views.HelpArticleViewSet)
router.register('message', views.MessageToSupportViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/help/title=<str:title>/', views.HelpArticleByTitle.as_view(), name='help-articles-by-title'),
    path('api/', include(router.urls)),


    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
         name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)