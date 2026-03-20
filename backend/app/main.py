# AI GENERATED FILE

from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")

from backend.app.config import settings

app = FastAPI(title="ChatGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def register_routers(application: FastAPI) -> None:
    from backend.app.routes.auth import router as auth_router
    from backend.app.routes.checks import router as checks_router
    from backend.app.routes.history import router as history_router
    from backend.app.routes.upload import router as upload_router

    application.include_router(auth_router)
    application.include_router(checks_router)
    application.include_router(history_router)
    application.include_router(upload_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


register_routers(app)
