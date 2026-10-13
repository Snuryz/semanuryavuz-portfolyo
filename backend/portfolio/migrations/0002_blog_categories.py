import django.db.models.deletion
from django.db import migrations, models
from django.utils.text import slugify

TURKISH_CHARS = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")

# Yeni açılan kategoriler: (ad, açıklama, eser sahibi etiketi, sıra)
NEW_CATEGORIES = [
    ("Kitaplar", "Okuduğum kitaplar üzerine notlar ve düşünceler.", "Yazar", 1),
    ("Filmler", "İzlediğim filmler üzerine yazılar.", "Yönetmen", 2),
]


def forwards(apps, schema_editor):
    Category = apps.get_model("portfolio", "Category")
    BlogPost = apps.get_model("portfolio", "BlogPost")

    def get_category(name, **extra):
        slug = slugify(name.translate(TURKISH_CHARS)) or "kategori"
        cat, _ = Category.objects.get_or_create(name=name, defaults={"slug": slug, **extra})
        return cat

    for name, description, label, order in NEW_CATEGORIES:
        get_category(name, description=description, creator_label=label, order=order)

    # Eski metin kategorileri yeni kategori kayıtlarına taşınır
    for post in BlogPost.objects.all():
        name = (post.category_old or "").strip()
        if name:
            post.category = get_category(name, order=10)
            post.save(update_fields=["category"])


def backwards(apps, schema_editor):
    BlogPost = apps.get_model("portfolio", "BlogPost")
    for post in BlogPost.objects.select_related("category"):
        post.category_old = post.category.name if post.category else ""
        post.save(update_fields=["category_old"])


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=60, unique=True, verbose_name="Ad")),
                ("slug", models.SlugField(blank=True, max_length=80, unique=True)),
                ("description", models.CharField(blank=True, help_text="Blog sayfasında bu kategori seçilince başlığın altında görünür.", max_length=240, verbose_name="Açıklama")),
                ("creator_label", models.CharField(blank=True, help_text="Bu kategorideki yazılar bir eser hakkındaysa: Kitaplar için 'Yazar', Filmler için 'Yönetmen'. Boş bırakılırsa eser bilgisi kutusu gösterilmez.", max_length=30, verbose_name="Eser sahibi etiketi")),
                ("order", models.PositiveIntegerField(default=0, help_text="Küçük sayı önce gelir.", verbose_name="Sıra")),
            ],
            options={
                "verbose_name": "Blog kategorisi",
                "verbose_name_plural": "Blog kategorileri",
                "ordering": ["order", "name"],
            },
        ),
        migrations.RenameField("blogpost", "category", "category_old"),
        migrations.AddField(
            model_name="blogpost",
            name="category",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="posts", to="portfolio.category", verbose_name="Kategori"),
        ),
        migrations.RunPython(forwards, backwards),
        migrations.RemoveField("blogpost", "category_old"),
        migrations.AddField(
            model_name="blogpost",
            name="work_title",
            field=models.CharField(blank=True, help_text="Yazı bir kitap ya da film hakkındaysa adı. Boşsa eser kutusu gösterilmez.", max_length=200, verbose_name="Eserin adı"),
        ),
        migrations.AddField(
            model_name="blogpost",
            name="work_creator",
            field=models.CharField(blank=True, max_length=150, verbose_name="Yazar / Yönetmen"),
        ),
        migrations.AddField(
            model_name="blogpost",
            name="work_year",
            field=models.PositiveSmallIntegerField(blank=True, null=True, verbose_name="Eserin yılı"),
        ),
        migrations.AddField(
            model_name="blogpost",
            name="rating",
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, "★☆☆☆☆"), (2, "★★☆☆☆"), (3, "★★★☆☆"), (4, "★★★★☆"), (5, "★★★★★")], null=True, verbose_name="Puanım"),
        ),
        migrations.AlterField(
            model_name="blogpost",
            name="cover",
            field=models.ImageField(blank=True, help_text="Kitap ve film yazılarında kitabın kapağı ya da filmin afişi.", upload_to="blog/", verbose_name="Kapak görseli"),
        ),
    ]
