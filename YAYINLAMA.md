# Siteyi Yayınlama Rehberi

Site iki parçadan oluşur ve ikisi ayrı yerlerde yayınlanır:

| Parça | Klasör | Önerilen yer | Ücret |
|---|---|---|---|
| Görünen site (React) | `frontend/` | Netlify | Ücretsiz |
| İçerik + admin paneli (Django) | `backend/` | PythonAnywhere | Ücretsiz (ya da ayda ~5 $) |

Önce **backend**'i yayınla, çünkü sitenin onun adresini bilmesi gerekiyor.

---

## 1. Backend — PythonAnywhere

1. https://www.pythonanywhere.com adresinden hesap aç. Kullanıcı adın backend adresin olur:
   `kullaniciadin.pythonanywhere.com`
2. **Files** sekmesinden `backend` klasörünü yükle. Şunları **yükleme**: `venv`, `staticfiles`, `__pycache__`.
   `db.sqlite3` ve `media` klasörünü **yükle**; içindeki projeler, yazılar ve görseller onlarda duruyor.
3. **Consoles → Bash** aç ve şunları çalıştır:
   ```
   cd backend
   python3.12 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```
4. **Web** sekmesinde **Add a new web app → Manual configuration → Python 3.12** seç.
   - **Source code:** `/home/kullaniciadin/backend`
   - **Virtualenv:** `/home/kullaniciadin/backend/venv`
   - **WSGI configuration file** dosyasını açıp içeriğini şununla değiştir:
     ```python
     import os, sys
     sys.path.insert(0, "/home/kullaniciadin/backend")
     os.environ["DJANGO_SETTINGS_MODULE"] = "backend.settings"
     os.environ["DJANGO_DEBUG"] = "0"
     os.environ["DJANGO_SECRET_KEY"] = "BURAYA-UZUN-RASTGELE-BIR-METIN"
     os.environ["DJANGO_ALLOWED_HOSTS"] = "kullaniciadin.pythonanywhere.com"
     os.environ["DJANGO_CORS_ORIGINS"] = "https://SITEADIN.netlify.app"
     os.environ["DJANGO_CSRF_TRUSTED_ORIGINS"] = "https://kullaniciadin.pythonanywhere.com"
     from django.core.wsgi import get_wsgi_application
     application = get_wsgi_application()
     ```
     Gizli anahtar için Bash'te şunu çalıştırıp çıkan metni kopyala:
     `python -c "import secrets; print(secrets.token_urlsafe(50))"`
   - **Static files** bölümüne ekle:
     | URL | Directory |
     |---|---|
     | `/media/` | `/home/kullaniciadin/backend/media` |
   - **Force HTTPS** seçeneğini aç.
5. Yeşil **Reload** düğmesine bas.
6. Kontrol et:
   - `https://kullaniciadin.pythonanywhere.com/api/projects/` → projeler listelenmeli
   - `https://kullaniciadin.pythonanywhere.com/admin/` → giriş sayfası
7. Admin hesabını sunucuda yeniden oluştur (bilgisayarındaki hesap taşınmaz):
   `python manage.py createsuperuser` — **güçlü bir şifre seç.**

> Ücretsiz planda hesabını yaklaşık 3 ayda bir **Web** sekmesindeki
> "Run until 3 months from today" düğmesiyle uzatman gerekir.

---

## 2. Site — Netlify

1. https://app.netlify.com → **Add new site → Deploy manually** ya da GitHub'a bağla.
2. GitHub ile bağlarsan ayarlar:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`
3. **Site configuration → Environment variables** bölümüne ekle:
   `REACT_APP_API_URL` = `https://kullaniciadin.pythonanywhere.com/api`
4. Yayınla. Netlify'ın verdiği adresi (`https://SITEADIN.netlify.app`), backend'deki
   `DJANGO_CORS_ORIGINS` satırına yazıp PythonAnywhere'de **Reload**'a bas.

**Elle yüklemek istersen:** `frontend` klasöründe `.env.production.local` dosyası oluşturup içine
`REACT_APP_API_URL=https://kullaniciadin.pythonanywhere.com/api` yaz, `npm run build` çalıştır
ve oluşan `build` klasörünü Netlify'a sürükle-bırak.

---

## 3. İçerik ekleme (yayından sonra)

`https://kullaniciadin.pythonanywhere.com/admin` adresinden giriş yapıp proje ve yazı eklersin.
Yüklediğin görseller otomatik olarak en fazla 1600 px genişliğe küçültülür.

## Kendi alan adını bağlamak (isteğe bağlı)

- Alan adını Netlify'da **Domain management** bölümünden siteye bağla.
- Backend için `api.alanadin.com` kullanmak istersen PythonAnywhere ücretli plan gerekir;
  o zaman yukarıdaki ortam değişkenlerindeki adresleri yeni alan adlarıyla güncelle.

## Yayından önce kontrol listesi

- [ ] Footer'daki `mail@site.com` ve GitHub linkini kendi bilgilerinle değiştir (`frontend/src/components/Footer.js`)
- [ ] İletişim bölümündeki GitHub adresini güncelle (`frontend/src/pages/Contact.js`)
- [ ] Örnek projeleri ve yazıları kendi içeriğinle değiştir ya da sil
- [ ] Admin şifresinin güçlü olduğundan emin ol
