# AI GENERATED FILE

from fastapi import APIRouter


router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/session")
def get_session() -> dict[str, object | None]:
    return {
        "authenticated": False,
        "user": None,
        "session_expires_at": None,
        "message": "Session handling is not connected yet.",
    }
