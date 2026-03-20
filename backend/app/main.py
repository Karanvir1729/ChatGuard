from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")

app = FastAPI(title="ChatGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def register_routers(application: FastAPI) -> None:
    # Register feature routers here as they are added.
    return None


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


register_routers(app)
