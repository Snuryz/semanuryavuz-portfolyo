from rest_framework import serializers

from .models import BlogPost, Category, ContactMessage, Project


class ProjectListSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(source="tag_list", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "slug", "title", "summary", "tags", "image",
            "live_url", "repo_url", "year", "is_featured",
        ]


class ProjectDetailSerializer(ProjectListSerializer):
    previous = serializers.SerializerMethodField()
    next = serializers.SerializerMethodField()

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + ["description", "previous", "next"]

    def _neighbour(self, obj, offset):
        items = list(Project.objects.filter(is_published=True).values("slug", "title"))
        index = next((i for i, p in enumerate(items) if p["slug"] == obj.slug), None)
        if index is None:
            return None
        target = index + offset
        return items[target] if 0 <= target < len(items) else None

    def get_previous(self, obj):
        return self._neighbour(obj, -1)

    def get_next(self, obj):
        return self._neighbour(obj, 1)


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["slug", "name", "description", "creator_label", "post_count"]


class CategoryBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["slug", "name", "creator_label"]


class BlogPostListSerializer(serializers.ModelSerializer):
    reading_minutes = serializers.IntegerField(read_only=True)
    category = CategoryBriefSerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id", "slug", "title", "category", "excerpt", "cover",
            "published_at", "reading_minutes",
            "work_title", "work_creator", "work_year", "rating",
        ]


class BlogPostDetailSerializer(BlogPostListSerializer):
    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + ["content", "updated_at"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "subject", "message"]
