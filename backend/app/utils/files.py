from __future__ import annotations

from pathlib import Path


def ensure_directory(path: str | Path) -> Path:
    directory = Path(path)
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def read_text_file(path: str | Path, default: str = "") -> str:
    file_path = Path(path)

    if not file_path.exists():
        return default

    return file_path.read_text(encoding="utf-8")


def write_text_file(path: str | Path, content: str) -> Path:
    file_path = Path(path)
    ensure_directory(file_path.parent)
    file_path.write_text(content, encoding="utf-8")
    return file_path


def get_file_name(path: str | Path) -> str:
    return Path(path).name
