from rest_framework import mixins, permissions, viewsets
from rest_framework.throttling import AnonRateThrottle

from .models import BlogPost, ContactMessage, Project
from .serializers import (
    BlogPostDetailSerializer,
    BlogPostListSerializer,
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
    GET /api/posts/<slug>/        -> yazı detayı
    """

    lookup_field = "slug"

    def get_queryset(self):
        qs = BlogPost.objects.filter(is_published=True)
        limit = self.request.query_params.get("limit")
        if limit and limit.isdigit():
            qs = qs[: int(limit)]
        return qs

    def get_serializer_class(self):
        return BlogPostDetailSerializer if self.action == "retrieve" else BlogPostListSerializer


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
