from rest_framework.test import APITestCase

from .models import BlogPost, ContactMessage, Project


class ProjectApiTests(APITestCase):
    def setUp(self):
        self.a = Project.objects.create(title="Kişisel Blog", summary="a", tags="React, Django", order=1)
        self.b = Project.objects.create(title="Yazılım Atölyesi", summary="b", order=2, is_featured=False)
        Project.objects.create(title="Gizli", summary="c", order=3, is_published=False)

    def test_slug_keeps_turkish_letters_readable(self):
        self.assertEqual(self.a.slug, "kisisel-blog")
        self.assertEqual(self.b.slug, "yazilim-atolyesi")

    def test_list_hides_unpublished_and_splits_tags(self):
        res = self.client.get("/api/projects/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual([p["title"] for p in res.data], ["Kişisel Blog", "Yazılım Atölyesi"])
        self.assertEqual(res.data[0]["tags"], ["React", "Django"])

    def test_featured_filter(self):
        res = self.client.get("/api/projects/?featured=1")
        self.assertEqual([p["slug"] for p in res.data], ["kisisel-blog"])

    def test_detail_has_neighbours(self):
        res = self.client.get("/api/projects/kisisel-blog/")
        self.assertEqual(res.status_code, 200)
        self.assertIsNone(res.data["previous"])
        self.assertEqual(res.data["next"]["slug"], "yazilim-atolyesi")

    def test_unpublished_detail_is_404(self):
        self.assertEqual(self.client.get("/api/projects/gizli/").status_code, 404)


class BlogApiTests(APITestCase):
    def test_limit_and_reading_time(self):
        for i in range(4):
            BlogPost.objects.create(title=f"Yazı {i}", excerpt="e", content="kelime " * 450)
        res = self.client.get("/api/posts/?limit=3")
        self.assertEqual(len(res.data), 3)
        self.assertEqual(res.data[0]["reading_minutes"], 3)
        self.assertNotIn("content", res.data[0])

        detail = self.client.get(f"/api/posts/{res.data[0]['slug']}/")
        self.assertIn("content", detail.data)


class ContactApiTests(APITestCase):
    def test_creates_message_without_csrf(self):
        client = self.client_class(enforce_csrf_checks=True)
        res = client.post(
            "/api/contact/",
            {"name": "Ada", "email": "ada@example.com", "message": "Merhaba"},
            format="json",
        )
        self.assertEqual(res.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_rejects_invalid_email(self):
        res = self.client.post(
            "/api/contact/", {"name": "Ada", "email": "yok", "message": "x"}, format="json"
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("email", res.data)

    def test_listing_messages_is_not_allowed(self):
        self.assertEqual(self.client.get("/api/contact/").status_code, 405)


class ImageOptimizeTests(APITestCase):
    def test_large_upload_is_resized_and_converted(self):
        import shutil
        import tempfile
        from io import BytesIO

        from django.core.files.uploadedfile import SimpleUploadedFile
        from django.test import override_settings
        from PIL import Image

        media = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, media, ignore_errors=True)
        buf = BytesIO()
        Image.new("RGB", (3200, 6000), "#884422").save(buf, "PNG")

        with override_settings(MEDIA_ROOT=media):
            p = Project.objects.create(
                title="Büyük", summary="s",
                image=SimpleUploadedFile("ekran.png", buf.getvalue(), content_type="image/png"),
            )
            self.assertTrue(p.image.name.endswith(".jpg"))
            with Image.open(p.image.path) as saved:
                self.assertEqual(saved.size, (1600, 3000))

            # Görsele dokunmadan tekrar kaydetmek görseli yeniden işlememeli
            name = p.image.name
            p.summary = "yeni"
            p.save()
            self.assertEqual(p.image.name, name)
