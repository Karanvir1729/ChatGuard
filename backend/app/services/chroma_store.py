from __future__ import annotations

import json
from pathlib import Path

from backend.app.config import settings
from backend.app.schemas import PolicyChunk
from backend.app.utils.text import clean_text


class ChromaStore:
    def __init__(self, persist_dir: Path | None = None) -> None:
        self.persist_dir = persist_dir or settings.chroma_dir
        self.persist_dir.mkdir(parents=True, exist_ok=True)
        self.index_path = self.persist_dir / "policy_chunks.json"

    def upsert_policy_chunks(
        self,
        course_code: str,
        chunks: list[PolicyChunk],
    ) -> list[PolicyChunk]:
        existing = self._read_chunks()
        filtered = [item for item in existing if item.course_code != course_code]
        updated = filtered + chunks
        self._write_chunks(updated)
        return chunks

    def query_policy_chunks(
        self,
        query: str,
        course_code: str | None = None,
        limit: int = 3,
    ) -> list[PolicyChunk]:
        chunks = self._read_chunks()

        if course_code:
            chunks = [item for item in chunks if item.course_code == course_code]

        scored_chunks = sorted(
            chunks,
            key=lambda item: self._score_chunk(item, query),
            reverse=True,
        )

        return scored_chunks[: max(limit, 0)]

    def _read_chunks(self) -> list[PolicyChunk]:
        if not self.index_path.exists():
            return []

        raw_items = json.loads(self.index_path.read_text(encoding="utf-8"))
        return [PolicyChunk.model_validate(item) for item in raw_items]

    def _write_chunks(self, chunks: list[PolicyChunk]) -> None:
        self.index_path.write_text(
            json.dumps(
                [chunk.model_dump(mode="json") for chunk in chunks],
                indent=2,
            ),
            encoding="utf-8",
        )

    def _score_chunk(self, chunk: PolicyChunk, query: str) -> int:
        query_tokens = set(clean_text(query).lower().split())
        content_tokens = set(
            clean_text(f"{chunk.section_title} {chunk.snippet}").lower().split()
        )

        if not query_tokens or not content_tokens:
            return 0

        return len(query_tokens & content_tokens)


chroma_store = ChromaStore()
