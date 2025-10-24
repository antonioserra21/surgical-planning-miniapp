# --- FastAPI and utility imports ---
# FastAPI: main framework for building web APIs
# UploadFile, File, Form: handle file uploads and form data in API endpoints
# HTTPException: raise structured HTTP errors when invalid input is detected
from fastapi import FastAPI, UploadFile, File, Form, HTTPException

# CORS middleware to allow requests from different origins (e.g., frontend running on another port)
from fastapi.middleware.cors import CORSMiddleware

# JSONResponse allows returning structured JSON data
from fastapi.responses import JSONResponse

# Pillow (PIL): used for image manipulation
from PIL import Image

# BytesIO: lets us treat raw bytes as a file-like object (needed to open uploaded images)
from io import BytesIO

# base64: used to encode images to base64 strings for sending back to the frontend
import base64

# --- Local processing utilities ---
# Custom functions for image enhancement and transformation
from .processing import increase_contrast, gaussian_smooth, to_png_b64

# --- Initialize FastAPI app ---
app = FastAPI(title="Surgical Planning Phase Simulator")

# --- CORS configuration ---
# This allows cross-origin requests (e.g., frontend running on localhost:3000)
# NOTE: currently allows all origins ("*") — restrict this in production!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Health check endpoint ---
# Simple GET endpoint to verify that the API server is running
@app.get("/health")
def health():
    return {"ok": True}

# --- Image processing endpoint ---
# Receives an image and a "phase" string (arterial or venous)
# Depending on the phase, it applies a specific image processing operation
@app.post("/process")
async def process(file: UploadFile = File(...), phase: str = Form(...)):
    # Validate phase parameter
    if phase not in {"arterial", "venous"}:
        raise HTTPException(status_code=400, detail="phase must be 'arterial' or 'venous'")

    # Validate file type
    if file.content_type not in {"image/png", "image/jpeg"}:
        raise HTTPException(status_code=400, detail="file must be PNG or JPEG")

    # Read image data from the uploaded file
    data = await file.read()

    # Try to open the image and convert it to RGB
    try:
        img = Image.open(BytesIO(data)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"invalid image: {e}")

    # Apply the appropriate image processing function depending on the selected phase
    proc = increase_contrast(img) if phase == "arterial" else gaussian_smooth(img)

    # Convert original and processed images to base64 strings for frontend display
    orig_b64 = to_png_b64(img)
    proc_b64 = to_png_b64(proc)

    # Return both original and processed images in JSON format
    return JSONResponse({"original_b64": orig_b64, "processed_b64": proc_b64})
