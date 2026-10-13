from rest_framework.routers import DefaultRouter

from .views import BlogPostViewSet, CategoryViewSet, ContactMessageViewSet, ProjectViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")
router.register("posts", BlogPostViewSet, basename="post")
router.register("categories", CategoryViewSet, basename="category")
router.register("contact", ContactMessageViewSet, basename="contact")

urlpatterns = router.urls
