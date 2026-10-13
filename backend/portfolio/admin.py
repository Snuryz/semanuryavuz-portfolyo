from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from .models import BlogPost, ContactMessage, Project

admin.site.site_header = "Portfolyo Yönetimi"
admin.site.site_title = "Portfolyo"
admin.site.index_title = "İçerikler"


class DeleteLinkMixin:
    """Listede her satırın sonuna doğrudan bir "Sil" bağlantısı ekler."""

    @admin.display(description="")
    def sil(self, obj):
        meta = obj._meta
        url = reverse(f"admin:{meta.app_label}_{meta.model_name}_delete", args=[obj.pk])
        return format_html('<a class="deletelink" href="{}">Sil</a>', url)


@admin.register(Project)
class ProjectAdmin(DeleteLinkMixin, admin.ModelAdmin):
    list_display = ["title", "tags", "year", "is_featured", "is_published", "order", "sil"]
    list_editable = ["is_featured", "is_published", "order"]
    search_fields = ["title", "summary", "tags"]
    prepopulated_fields = {"slug": ["title"]}


@admin.register(BlogPost)
class BlogPostAdmin(DeleteLinkMixin, admin.ModelAdmin):
    list_display = ["title", "category", "published_at", "is_published", "sil"]
    list_editable = ["is_published"]
    list_filter = ["category", "is_published"]
    search_fields = ["title", "excerpt", "content"]
    prepopulated_fields = {"slug": ["title"]}
    date_hierarchy = "published_at"


@admin.register(ContactMessage)
class ContactMessageAdmin(DeleteLinkMixin, admin.ModelAdmin):
    list_display = ["name", "email", "subject", "created_at", "is_read", "sil"]
    list_editable = ["is_read"]
    list_filter = ["is_read"]
    search_fields = ["name", "email", "subject", "message"]
    readonly_fields = ["name", "email", "subject", "message", "created_at"]

    def has_add_permission(self, request):
        return False
