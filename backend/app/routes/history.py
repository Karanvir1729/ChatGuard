from backend.app.schemas import HistoryItem
from backend.app.storage import storage
from fastapi import APIRouter


router = APIRouter(tags=["history"])


@router.get("/history", response_model=list[HistoryItem])
def get_history() -> list[HistoryItem]:
    completed_items = [
        HistoryItem(
            id=check.id,
            title=f"Check {check.id}",
            course_code=check.suspected_course,
            status="completed",
            decision=check.classification,
            updated_at=check.updated_at,
        )
        for check in storage.list_checks()
    ]

    combined_items = [*storage.list_drafts(), *completed_items]
    return sorted(combined_items, key=lambda item: item.updated_at, reverse=True)
