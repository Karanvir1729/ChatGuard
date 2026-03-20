# AI GENERATED FILE

from dataclasses import dataclass
from pathlib import Path
import os


ROOT_DIR = Path(__file__).resolve().parents[2]


def _resolve_path(value: str | Path) -> Path:
    path = Path(value).expanduser()

    if not path.is_absolute():
        path = ROOT_DIR / path

    return path


@dataclass(slots=True)
class Settings:
    frontend_origin: str
    chroma_dir: Path
    llm_endpoint: str
    llm_model: str
    upload_dir: Path

    @classmethod
    def from_env(cls) -> "Settings":
        frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://127.0.0.1:5173")
        chroma_dir = _resolve_path(
            os.getenv("CHROMA_PERSIST_DIR", ROOT_DIR / "backend" / ".chroma")
        )
        llm_endpoint = os.getenv("LOCAL_LLM_ENDPOINT", "http://127.0.0.1:11434")
        llm_model = os.getenv("LOCAL_LLM_MODEL", "qwen2.5:0.5b")
        upload_dir = _resolve_path(
            os.getenv("UPLOAD_DIR", ROOT_DIR / "backend" / "uploads")
        )

        chroma_dir.mkdir(parents=True, exist_ok=True)
        upload_dir.mkdir(parents=True, exist_ok=True)

        return cls(
            frontend_origin=frontend_origin,
            chroma_dir=chroma_dir,
            llm_endpoint=llm_endpoint,
            llm_model=llm_model,
            upload_dir=upload_dir,
        )


settings = Settings.from_env()
