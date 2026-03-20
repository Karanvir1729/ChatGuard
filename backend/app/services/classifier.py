from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from backend.app.schemas import CheckResult, CheckSubmission, PolicyChunk


def build_mock_result(
    submission: CheckSubmission,
    policy_chunks: list[PolicyChunk],
    check_id: str | None = None,
) -> CheckResult:
    now = datetime.utcnow()
    course_code = submission.context.course_code.strip() or "Unknown course"
    assignment_type = submission.context.assignment_type or "assignment"
    conversation_size = len(submission.conversation_text.strip())

    if conversation_size > 1200:
        classification = "Allowed With Advisory"
        risk_level = "Moderate"
    elif conversation_size > 0 or submission.conversation_file:
        classification = "Likely Allowed"
        risk_level = "Minimal"
    else:
        classification = "Needs Caution"
        risk_level = "Moderate"

    reasoning = [
        "This is a mock classification intended to support the frontend flow.",
        "The current result weighs conversation completeness and available course context.",
        "Policy chunks are placeholder matches until live retrieval is added.",
    ]

    safer_next_steps = [
        "Review the final submission in your own words before turning it in.",
        "Check the assignment instructions against the matched policy notes.",
        "Ask your instructor or TA if the boundary of acceptable AI use is unclear.",
    ]

    summary = (
        f"The current review suggests the conversation looks most consistent with supported help for a {assignment_type.lower()}. "
        "It would still be sensible to compare the final submission against course-specific expectations."
    )

    return CheckResult(
        id=check_id or f"check-{uuid4().hex[:8]}",
        summary=summary,
        suspected_course=course_code,
        classification=classification,
        risk_level=risk_level,
        status="completed",
        reasoning=reasoning,
        matched_policies=policy_chunks,
        safer_next_steps=safer_next_steps,
        created_at=now,
        updated_at=now,
    )
