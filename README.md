# Surgical Planning — Phase Simulator (Mini Web App)

**Goal:** Demonstrate an end-to-end full-stack workflow for a MedTech surgical planning scenario.  
The app uploads a 2D medical image (PNG/JPG), simulates a selected phase on the **backend** (Python), and shows **original vs processed** images side-by-side on the **frontend**.

> ⚠️ Clinical note: The image processing is a **simulation only** and has **no clinical purpose**.

---

## Live Demo

- **Frontend (GitHub Pages):** https://antonioserra21.github.io/surgical-planning-miniapp/
- **Backend (Hugging Face Space):** https://antonioserra21-app-test-surgical.hf.space

---

## Features

- Upload PNG/JPG
- Choose phase:
  - **Arterial:** increased contrast
  - **Venous:** Gaussian smoothing
- Processing happens **entirely on the backend**
- Clear, simple UI with status messages and error handling

---

## Tech Stack

- **Frontend:** Vite + React + TypeScript + Tailwind
- **Backend:** FastAPI (Python), Pillow for image ops
- **Hosting:** GitHub Pages (frontend), Hugging Face Spaces (backend)

---

## Repository Structure

- frontend/ # React app (static)
- backend/ # FastAPI app (Python)
- docs/ # Built frontend for GitHub Pages (if using /docs deploy)

---

## How to Run Locally

### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080
Health check: http://localhost:8080/health  -> {"ok": true}
Swagger:      http://localhost:8080/docs
```

### Frontend
```bash
cd frontend
# For local dev, point to local API:
echo "VITE_API_URL=http://localhost:8080" > .env.local
pnpm install
pnpm dev
# Open http://localhost:5173
```
