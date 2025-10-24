from io import BytesIO
import base64
from PIL import Image, ImageEnhance, ImageFilter

def to_png_b64(img: Image.Image) -> str:
    buf = BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

def increase_contrast(img: Image.Image, factor: float = 1.6) -> Image.Image:
    # Simulate arterial phase: boost contrast (and a touch of autocontrast)
    img = img.convert("RGB")
    enhanced = ImageEnhance.Contrast(img).enhance(factor)
    return enhanced

def gaussian_smooth(img: Image.Image, sigma: float = 1.6) -> Image.Image:
    # Simulate venous phase: gaussian blur
    img = img.convert("RGB")
    return img.filter(ImageFilter.GaussianBlur(radius=sigma))
