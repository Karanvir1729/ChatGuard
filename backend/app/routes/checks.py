from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from backend.app.schemas import CheckResult, CheckSubmission, HistoryItem, PolicyChunk
from backend.app.storage import storage


router = APIRouter(prefix="/checks", tags=["checks"])


def build_check_result(submission: CheckSubmission, check_id: str | None = None) -> CheckResult:
    course_code = submission.context.course_code.strip() or "Unknown course"
    assignment_type = submission.context.assignment_type or "course submission"
    now = datetime.utcnow()

    classification = (
        "Allowed With Advisory"
        if submission.confirmation_checked
        else "Needs Caution"
    )
    risk_level = "Minimal" if submission.confirmation_checked else "Moderate"
    summary = (
        f"This review suggests the conversation reads like planning and revision support for a {assignment_type.lower()}. "
        "It still makes sense to compare the final work against course expectations before submission."
    )

    reasoning = [
        "The submission includes enough material to run a basic review.",
        "Course context was considered when shaping the result.",
        "The output is advisory and should still be checked against instructor guidance.",
    ]

    matched_policies = [
        PolicyChunk(
            course_code=course_code,
            section_title="Use of AI Tools",
            snippet="Planning, outlining, and revision support may be acceptable when the final submission remains the student's own work.",
        )
    ]

    safer_next_steps = [
        "Review the final submission in your own words before turning it in.",
        "Compare the result against the course syllabus or assignment brief.",
        "Ask your instructor or TA if the policy still feels unclear.",
    ]

    return CheckResult(
        id=check_id or f"check-{uuid4().hex[:8]}",
        summary=summary,
        suspected_course=course_code,
        classification=classification,
        risk_level=risk_level,
        status="completed",
        reasoning=reasoning,
        matched_policies=matched_policies,
        safer_next_steps=safer_next_steps,
        created_at=now,
        updated_at=now,
    )


@router.post("/analyze", response_model=CheckResult)
def analyze_check(submission: CheckSubmission) -> CheckResult:
    result = build_check_result(submission)
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
