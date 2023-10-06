from django.contrib import admin
from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers, permissions
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from users.views import AccountActivationView, UserFilterView, UserViewSet, \
    SubscriptionViewSet, LoginAPIView, CustomTokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="users_microservice",
        default_version='0.1',
        description="Documentation to out project",
        contact=openapi.Contact(email="gtoll@yandex.ru"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
# router.register(r'users/(?P<username>[^/.]+)', UserViewSet, basename='user_by_username')
router.register(r'subscriptions', SubscriptionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/auth/token/', LoginAPIView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/activation/', AccountActivationView.as_view(), name='account_activate'),
    path('api/users/filter/', UserFilterView.as_view(), name='user-filter'),
    path('api/subscriptions/from/<int:pk>/',
         SubscriptionViewSet.as_view({'get': 'from_user'}), name="from_user-subscriptions"),
    path('api/subscriptions/to/<int:pk>/',
         SubscriptionViewSet.as_view({'get': 'to_user'}), name="to_user-subscriptions"),
    path('api/subscriptions/', SubscriptionViewSet.as_view({'delete': 'destroy', 'post': 'create', 'get': 'list'})),


    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
         name='schema-redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
