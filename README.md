# ChatGuard

ChatGuard is a desktop-first prototype for reviewing AI-assisted coursework submissions before they are turned in.

## Stack

- Frontend: React + Vite
- Backend: FastAPI
- Data: Supabase, Chroma, local LLM endpoint

## Setup

1. Copy `.env.example` to `.env`.
2. Install root dependencies:

   ```bash
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Install backend dependencies:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```

5. Run from the repo root:

```bash
npm run dev
npm run dev:frontend
npm run dev:backend
```

## Notes

- The frontend uses mock data first while the real flow is being wired up.
- This repo is a prototype, not a production-ready system.
