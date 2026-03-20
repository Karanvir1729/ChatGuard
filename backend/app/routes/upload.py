# AI GENERATED FILE

from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.app.config import settings


router = APIRouter(prefix="/upload", tags=["upload"])


def save_upload(file: UploadFile, subdirectory: str) -> dict[str, str | int]:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file must have a filename.")

    target_dir = settings.upload_dir / subdirectory
    target_dir.mkdir(parents=True, exist_ok=True)

    suffix = Path(file.filename).suffix
    stored_name = f"{uuid4().hex[:8]}{suffix}"
    target_path = target_dir / stored_name
    content = file.file.read()
    target_path.write_bytes(content)

    return {
        "filename": stored_name,
        "original_filename": file.filename,
        "path": str(target_path),
        "content_type": file.content_type or "application/octet-stream",
        "size": len(content),
    }


@router.post("/conversation")
def upload_conversation(file: UploadFile = File(...)) -> dict[str, str | int]:
    return save_upload(file, "conversation")


@router.post("/syllabus")
def upload_syllabus(file: UploadFile = File(...)) -> dict[str, str | int]:
    return save_upload(file, "syllabus")
