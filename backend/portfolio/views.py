from django.db.models import Count, Q
from rest_framework import mixins, permissions, viewsets
from rest_framework.throttling import AnonRateThrottle

from .models import BlogPost, Category, ContactMessage, Project
from .serializers import (
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    CategorySerializer,
    ContactMessageSerializer,
    ProjectDetailSerializer,
    ProjectListSerializer,
)


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/projects/            -> tüm projeler
    GET /api/projects/?featured=1 -> yalnızca ana sayfada gösterilecekler
    GET /api/projects/<slug>/     -> proje detayı
    """

    lookup_field = "slug"

    def get_queryset(self):
        qs = Project.objects.filter(is_published=True)
        if self.request.query_params.get("featured") in ("1", "true"):
            qs = qs.filter(is_featured=True)
        return qs

    def get_serializer_class(self):
        return ProjectDetailSerializer if self.action == "retrieve" else ProjectListSerializer


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/posts/               -> tüm yazılar
    GET /api/posts/?limit=3       -> en yeni 3 yazı
    GET /api/posts/?category=kitaplar -> bir kategorinin yazıları
    GET /api/posts/<slug>/        -> yazı detayı
    """

    lookup_field = "slug"

    def get_queryset(self):
        qs = BlogPost.objects.filter(is_published=True).select_related("category")
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__slug=category)
        limit = self.request.query_params.get("limit")
        if limit and limit.isdigit():
            qs = qs[: int(limit)]
        return qs

    def get_serializer_class(self):
        return BlogPostDetailSerializer if self.action == "retrieve" else BlogPostListSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/categories/ -> blog kategorileri ve yayındaki yazı sayıları"""

    serializer_class = CategorySerializer
    lookup_field = "slug"
    pagination_class = None

    def get_queryset(self):
        return Category.objects.annotate(
            post_count=Count("posts", filter=Q(posts__is_published=True))
        ).order_by("order", "name")


class ContactThrottle(AnonRateThrottle):
    rate = "5/hour"


class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """POST /api/contact/ -> iletişim formundan gelen mesajı kaydeder."""

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    # Oturum doğrulaması kullanılmadığı için CSRF jetonu gerekmez
    authentication_classes = []
    throttle_classes = [ContactThrottle]
