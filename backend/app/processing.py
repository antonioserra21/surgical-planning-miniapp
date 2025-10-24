# --- Standard library imports ---
# BytesIO: allows treating in-memory byte data like a file (useful for image encoding)
from io import BytesIO

# base64: used to encode image bytes into a base64 string (for transmission via JSON)
import base64

# --- Pillow (PIL) imports ---
# Image: core class for image objects
# ImageEnhance: used to adjust contrast, brightness, sharpness, etc.
# ImageFilter: provides pre-defined filters (e.g., Gaussian blur)
from PIL import Image, ImageEnhance, ImageFilter


# --- Helper function: convert PIL image to base64-encoded PNG ---
def to_png_b64(img: Image.Image) -> str:
    """
    Convert a PIL Image object into a base64-encoded PNG string.
    
    Steps:
    1. Save the image to a BytesIO buffer in PNG format.
    2. Read the buffer and encode its content in base64.
    3. Return the encoded string as UTF-8 text.
    """
    buf = BytesIO()
    img.save(buf, format="PNG")  # save image in memory as PNG
    return base64.b64encode(buf.getvalue()).decode("utf-8")


# --- Image processing function: increase contrast ---
def increase_contrast(img: Image.Image, factor: float = 1.6) -> Image.Image:
    """
    Boost the contrast of an image — used to simulate the arterial phase.

    Parameters:
        img (PIL.Image.Image): input image
        factor (float): contrast enhancement factor (>1 increases contrast)

    Returns:
        PIL.Image.Image: contrast-enhanced image
    """
    img = img.convert("RGB")  # ensure image is in RGB mode
    enhanced = ImageEnhance.Contrast(img).enhance(factor)
    return enhanced


# --- Image processing function: apply Gaussian smoothing ---
def gaussian_smooth(img: Image.Image, sigma: float = 1.6) -> Image.Image:
    """
    Apply Gaussian blur to an image — used to simulate the venous phase.

    Parameters:
        img (PIL.Image.Image): input image
        sigma (float): blur radius; higher values increase blurring

    Returns:
        PIL.Image.Image: blurred image
    """
    img = img.convert("RGB")  # ensure image is in RGB mode
    return img.filter(ImageFilter.GaussianBlur(radius=sigma))
