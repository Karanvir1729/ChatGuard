from __future__ import annotations

from datetime import datetime

from backend.app.schemas import HistoryItem
from backend.app.storage import storage


class DraftStore:
    def save(self, draft: HistoryItem) -> HistoryItem:
        return storage.save_draft(draft)

    def get(self, draft_id: str) -> HistoryItem | None:
        return storage.get_draft(draft_id)

    def list(self) -> list[HistoryItem]:
        return storage.list_drafts()

    def write(
        self,
        *,
        draft_id: str,
        title: str,
        course_code: str,
        decision: str = "Draft saved",
    ) -> HistoryItem:
        draft = HistoryItem(
            id=draft_id,
            title=title,
            course_code=course_code,
            status="draft",
            decision=decision,
            updated_at=datetime.utcnow(),
        )
        return self.save(draft)


draft_store = DraftStore()
