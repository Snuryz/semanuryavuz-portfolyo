"""
Sitedeki örnek projeleri ve blog yazılarını veritabanına ekler.

    python manage.py seed_portfolio

Aynı başlıkta kayıt varsa atlanır; komut birden çok kez güvenle çalıştırılabilir.
İçerikler örnektir, admin panelinden (/admin) düzenleyin.
"""
from datetime import timedelta
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils import timezone

from portfolio.models import BlogPost, Project

ASSETS = Path(settings.BASE_DIR).parent / "frontend" / "src" / "assets"

DEMO_NOTE = "Bu metin örnek içeriktir; admin panelinden kendi anlatımınızla değiştirin."

PROJECTS = [
    {
        "title": "Kişisel Blog",
        "summary": "React ve Django ile geliştirdiğim kişisel blog projesi.",
        "tags": "React, Django",
        "image": "card1.jpg",
        "order": 1,
    },
    {
        "title": "Portfolyo Sitesi",
        "summary": "Modern ve dinamik portfolyo web sitesi.",
        "tags": "React, CSS",
        "image": "card2.jpg",
        "order": 2,
    },
    {
        "title": "E-Ticaret Uygulaması",
        "summary": "Basit bir e-ticaret uygulaması (React + Django REST).",
        "tags": "React, Django REST",
        "image": "card3.jpg",
        "order": 3,
    },
]

POSTS = [
    {
        "title": "React ile Dinamik Formlar",
        "category": "Geliştirme",
        "excerpt": "React'ta dinamik ve kontrollü formlar nasıl oluşturulur? "
                   "Kod örnekleriyle adım adım anlatım.",
        "days_ago": 30,
    },
    {
        "title": "Django REST API Temelleri",
        "category": "Backend",
        "excerpt": "Django REST Framework ile API geliştirme sürecinin temel adımları ve ipuçları.",
        "days_ago": 20,
    },
    {
        "title": "Web'de Vintage Tasarım",
        "category": "Tasarım",
        "excerpt": "Vintage tasarım trendleri ve web projelerinde uygulanışı.",
        "days_ago": 10,
    },
]


class Command(BaseCommand):
    help = "Örnek projeleri ve blog yazılarını veritabanına ekler."

    def handle(self, *args, **options):
        for data in PROJECTS:
            if Project.objects.filter(title=data["title"]).exists():
                self.stdout.write(f"  atlandı (zaten var): {data['title']}")
                continue
            project = Project(
                title=data["title"],
                summary=data["summary"],
                description=f"{data['summary']}\n\n{DEMO_NOTE}",
                tags=data["tags"],
                order=data["order"],
            )
            image_path = ASSETS / data["image"]
            if image_path.exists():
                with image_path.open("rb") as f:
                    project.image.save(data["image"], File(f), save=False)
            project.save()
            self.stdout.write(self.style.SUCCESS(f"  proje eklendi: {project.title}"))

        for data in POSTS:
            if BlogPost.objects.filter(title=data["title"]).exists():
                self.stdout.write(f"  atlandı (zaten var): {data['title']}")
                continue
            post = BlogPost.objects.create(
                title=data["title"],
                category=data["category"],
                excerpt=data["excerpt"],
                content=f"{data['excerpt']}\n\n## Taslak\n\n{DEMO_NOTE}",
                published_at=timezone.now() - timedelta(days=data["days_ago"]),
            )
            self.stdout.write(self.style.SUCCESS(f"  yazı eklendi: {post.title}"))
