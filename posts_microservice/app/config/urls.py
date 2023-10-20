from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from posts.views import PostView, PostDetailView, PostsFromUserView, PostFilterView
from posts.views import CategoryView, CategoryUpdateView
from posts.views import LikeView, PostLikesView, UserLikesView

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

urlpatterns = [path('api/post/', PostView.as_view(), name='post-list'),
               path('api/post/<int:userId>/', PostView.as_view(), name='post-list-create-by-user'),
               path('api/post/detail/<int:pk>/', PostDetailView.as_view(), name='post-retrieve-update'),
               path('api/post/filter/', PostFilterView.as_view(), name='post-filter'),
               path('api/category/', CategoryView.as_view(), name='category-list-create'),
               path('api/category/<int:pk>/', CategoryUpdateView.as_view(), name='category-update'),
               path('api/post/like/', LikeView.as_view(), name='like-post'),
               path('api/post/p-likes/<int:post_id>/', PostLikesView.as_view(), name='post-likes'),
               path('api/post/u-likes/<int:user_id>/', UserLikesView.as_view(), name='user-likes'),
               path('api/post/from-user/<int:user_id>/', PostsFromUserView.as_view(), name='user-posts'),

               re_path(r'^swagger(?P<format>\.json|\.yaml)$',
                       schema_view.without_ui(cache_timeout=0), name='schema-json'),
               path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
                    name='schema-swagger-ui'),
               path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
                    name='schema-redoc'),
               ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
