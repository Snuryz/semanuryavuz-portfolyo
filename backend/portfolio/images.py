from io import BytesIO
from pathlib import Path

from django.core.files.base import ContentFile
from PIL import Image, ImageOps

MAX_WIDTH = 1600


def optimize_image(field, max_width=MAX_WIDTH):
    """
    Yeni yüklenen görseli en fazla max_width genişliğe küçültür ve sıkıştırır.
    Şeffaflığı olmayan görseller JPEG'e çevrilir. Zaten kaydedilmiş görsellere dokunmaz.
    """
    if not field or getattr(field, "_committed", True):
        return

    field.open()
    img = Image.open(field)
    img = ImageOps.exif_transpose(img)  # telefon fotoğraflarının yönünü düzelt

    if img.width > max_width:
        height = round(img.height * max_width / img.width)
        img = img.resize((max_width, height), Image.LANCZOS)

    has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
    buffer = BytesIO()
    stem = Path(field.name).stem
    if has_alpha:
        img.save(buffer, "WEBP", quality=82, method=6)
        name = f"{stem}.webp"
    else:
        img.convert("RGB").save(buffer, "JPEG", quality=84, optimize=True, progressive=True)
        name = f"{stem}.jpg"

    field.save(name, ContentFile(buffer.getvalue()), save=False)
