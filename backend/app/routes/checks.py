# AI GENERATED FILE

from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from backend.app.schemas import CheckResult, CheckSubmission, HistoryItem
from backend.app.services.classifier import classify_submission
from backend.app.services.retrieval import retrieve_policy_chunks
from backend.app.storage import storage


router = APIRouter(prefix="/checks", tags=["checks"])


@router.post("/analyze", response_model=CheckResult)
def analyze_check(submission: CheckSubmission) -> CheckResult:
    policy_chunks = retrieve_policy_chunks(submission.context.course_code)
    result = classify_submission(submission, policy_chunks)
    return storage.save_check(result)


@router.post("/draft", response_model=HistoryItem)
def save_check_draft(submission: CheckSubmission) -> HistoryItem:
    draft_id = f"draft-{uuid4().hex[:8]}"
    course_code = submission.context.course_code.strip() or "TBD000"
    title = submission.context.assignment_type or "Saved Draft"
    updated_at = datetime.utcnow()

    draft = HistoryItem(
        id=draft_id,
        title=title,
        course_code=course_code,
        status="draft",
        decision="Draft",
        updated_at=updated_at,
    )

    return storage.save_draft(draft)


@router.get("/{check_id}", response_model=CheckResult)
def get_check(check_id: str) -> CheckResult:
    check = storage.get_check(check_id)

    if not check:
        raise HTTPException(status_code=404, detail="Check not found.")

    return check
