import math

from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from .images import optimize_image


# slugify "ı" gibi ayrıştırılamayan harfleri siler; önce Latin karşılıklarına çeviriyoruz
TURKISH_CHARS = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")


def unique_slug(instance, value):
    """Başlıktan benzersiz bir slug üretir (örn. "kisisel-blog", "kisisel-blog-2")."""
    base = slugify(value.translate(TURKISH_CHARS)) or "icerik"
    slug, n = base, 2
    model = type(instance)
    while model.objects.filter(slug=slug).exclude(pk=instance.pk).exists():
        slug = f"{base}-{n}"
        n += 1
    return slug


class Project(models.Model):
    title = models.CharField("Başlık", max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    summary = models.CharField(
        "Kısa açıklama", max_length=260,
        help_text="Kartlarda ve listede görünen bir-iki cümlelik özet.",
    )
    description = models.TextField(
        "Detaylı anlatım", blank=True,
        help_text="Proje sayfasında görünür. Paragrafları boş satırla ayırın; "
                  "'## ' ile başlayan satırlar ara başlık olur.",
    )
    tags = models.CharField(
        "Teknolojiler", max_length=200, blank=True,
        help_text="Virgülle ayırın: React, Django REST, CSS",
    )
    image = models.ImageField(
        "Ekran görüntüsü", upload_to="projects/", blank=True,
        help_text="Tercihen uzun, tam sayfa bir ekran görüntüsü.",
    )
    live_url = models.URLField("Canlı site adresi", blank=True)
    repo_url = models.URLField("Kaynak kod adresi", blank=True)
    year = models.PositiveSmallIntegerField("Yıl", null=True, blank=True)
    is_featured = models.BooleanField(
        "Ana sayfada göster", default=True,
        help_text="Ana sayfadaki Projelerim bölümünde listelenir.",
    )
    is_published = models.BooleanField("Yayında", default=True)
    order = models.PositiveIntegerField("Sıra", default=0, help_text="Küçük sayı önce gelir.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Proje"
        verbose_name_plural = "Projeler"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.title)
        optimize_image(self.image)
        super().save(*args, **kwargs)

    @property
    def tag_list(self):
        return [t.strip() for t in self.tags.split(",") if t.strip()]


class Category(models.Model):
    name = models.CharField("Ad", max_length=60, unique=True)
    slug = models.SlugField(max_length=80, unique=True, blank=True)
    description = models.CharField(
        "Açıklama", max_length=240, blank=True,
        help_text="Blog sayfasında bu kategori seçilince başlığın altında görünür.",
    )
    creator_label = models.CharField(
        "Eser sahibi etiketi", max_length=30, blank=True,
        help_text="Bu kategorideki yazılar bir eser hakkındaysa: Kitaplar için 'Yazar', "
                  "Filmler için 'Yönetmen'. Boş bırakılırsa eser bilgisi kutusu gösterilmez.",
    )
    order = models.PositiveIntegerField("Sıra", default=0, help_text="Küçük sayı önce gelir.")

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Blog kategorisi"
        verbose_name_plural = "Blog kategorileri"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.name)
        super().save(*args, **kwargs)


class BlogPost(models.Model):
    title = models.CharField("Başlık", max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.ForeignKey(
        Category, verbose_name="Kategori", null=True, blank=True,
        on_delete=models.SET_NULL, related_name="posts",
    )
    excerpt = models.CharField(
        "Özet", max_length=300,
        help_text="Listede görünen kısa giriş.",
    )
    content = models.TextField(
        "İçerik",
        help_text="Paragrafları boş satırla ayırın. '## ' ara başlık, '> ' alıntı, "
                  "``` ile başlayıp biten bloklar kod olarak gösterilir.",
    )
    cover = models.ImageField(
        "Kapak görseli", upload_to="blog/", blank=True,
        help_text="Kitap ve film yazılarında kitabın kapağı ya da filmin afişi.",
    )

    # Kitap / film gibi bir eser hakkındaki yazılar için (isteğe bağlı)
    work_title = models.CharField(
        "Eserin adı", max_length=200, blank=True,
        help_text="Yazı bir kitap ya da film hakkındaysa adı. Boşsa eser kutusu gösterilmez.",
    )
    work_creator = models.CharField(
        "Yazar / Yönetmen", max_length=150, blank=True,
    )
    work_year = models.PositiveSmallIntegerField("Eserin yılı", null=True, blank=True)
    rating = models.PositiveSmallIntegerField(
        "Puanım", null=True, blank=True,
        choices=[(i, "★" * i + "☆" * (5 - i)) for i in range(1, 6)],
    )

    is_published = models.BooleanField("Yayında", default=True)
    published_at = models.DateTimeField("Yayın tarihi", default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at"]
        verbose_name = "Blog yazısı"
        verbose_name_plural = "Blog yazıları"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.title)
        optimize_image(self.cover)
        super().save(*args, **kwargs)

    @property
    def reading_minutes(self):
        words = len(self.content.split())
        return max(1, math.ceil(words / 200))


class ContactMessage(models.Model):
    name = models.CharField("Ad", max_length=120)
    email = models.EmailField("E-posta")
    subject = models.CharField("Konu", max_length=200, blank=True)
    message = models.TextField("Mesaj", max_length=5000)
    is_read = models.BooleanField("Okundu", default=False)
    created_at = models.DateTimeField("Gönderilme", auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "İletişim mesajı"
        verbose_name_plural = "İletişim mesajları"

    def __str__(self):
        return f"{self.name} — {self.subject or 'Konusuz'}"
