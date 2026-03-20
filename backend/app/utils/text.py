from __future__ import annotations

import re


def collapse_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def clean_text(value: str) -> str:
    normalized = value.replace("\r\n", "\n").replace("\r", "\n").strip()
    normalized = re.sub(r"[ \t]+", " ", normalized)
    normalized = re.sub(r"\n{3,}", "\n\n", normalized)
    return normalized.strip()


def chunk_text(text: str, chunk_size: int = 1200, overlap: int = 150) -> list[str]:
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than 0")

    normalized = clean_text(text)
    if not normalized:
        return []

    overlap = max(0, min(overlap, chunk_size - 1))
    chunks: list[str] = []
    start = 0

    while start < len(normalized):
        end = min(len(normalized), start + chunk_size)
        chunk = normalized[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= len(normalized):
            break

        start = end - overlap

    return chunks
