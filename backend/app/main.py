from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from io import BytesIO
import base64

from .processing import increase_contrast, gaussian_smooth, to_png_b64

app = FastAPI(title="Surgical Planning Phase Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/process")
async def process(file: UploadFile = File(...), phase: str = Form(...)):
    if phase not in {"arterial", "venous"}:
        raise HTTPException(status_code=400, detail="phase must be 'arterial' or 'venous'")
    if file.content_type not in {"image/png", "image/jpeg"}:
        raise HTTPException(status_code=400, detail="file must be PNG or JPEG")

    data = await file.read()
    try:
        img = Image.open(BytesIO(data)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"invalid image: {e}")

    proc = increase_contrast(img) if phase == "arterial" else gaussian_smooth(img)

    orig_b64 = to_png_b64(img)
    proc_b64 = to_png_b64(proc)
    return JSONResponse({"original_b64": orig_b64, "processed_b64": proc_b64})
