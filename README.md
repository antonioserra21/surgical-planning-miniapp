# Surgical Planning Mini‑App (Arterial/Venous Simulation)

**Goal**: Upload a 2D image (PNG/JPG), choose a phase, process on backend (Python), and show original vs processed side‑by‑side.

- Frontend: React + Vite + TS + Tailwind — deploy on GitHub Pages.
- Backend: FastAPI (Python) — deploy on Hugging Face Spaces (separate server).

## Live URLs (fill after deploy)
- Frontend (GitHub Pages): https://<user>.github.io/<repo>/
- Backend (HF Space REST): https://huggingface.co/spaces/<user>/<space-name>

## Quick start (local dev)
```bash
# Frontend
cd frontend
pnpm i
pnpm dev

# Backend
cd ../backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080
