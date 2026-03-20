# AI GENERATED FILE

from __future__ import annotations

from datetime import datetime
import json
from pathlib import Path
from uuid import uuid4

from backend.app.schemas import CheckResult, CheckSubmission, PolicyChunk
from backend.app.services.kimi_client import kimi_client


PROMPT_PATH = Path(__file__).resolve().parents[1] / "prompts" / "classify_check.txt"
VALID_CLASSIFICATIONS = {
    "Likely Allowed",
    "Allowed With Advisory",
    "Needs Caution",
    "High Risk",
}
VALID_RISK_LEVELS = {
    "Minimal",
    "Moderate",
    "Elevated",
    "High",
}


def _load_prompt_template() -> str:
    return PROMPT_PATH.read_text(encoding="utf-8").strip()


def _build_prompt(
    submission: CheckSubmission,
    policy_chunks: list[PolicyChunk],
) -> str:
    policy_payload = [chunk.model_dump() for chunk in policy_chunks]

    return (
        f"{_load_prompt_template()}\n\n"
        f"Conversation:\n{submission.conversation_text.strip() or 'No conversation text provided.'}\n\n"
        "Course context:\n"
        f"- Institution: {submission.context.institution or 'Unknown'}\n"
        f"- Course code: {submission.context.course_code or 'Unknown'}\n"
        f"- UofT student: {'yes' if submission.context.is_uoft_student else 'no'}\n"
        f"- Assignment type: {submission.context.assignment_type or 'Unknown'}\n"
        f"- Student status: {submission.context.student_status or 'Unknown'}\n"
        f"- Conversation file attached: {'yes' if submission.conversation_file else 'no'}\n"
        f"- Syllabus file attached: {'yes' if submission.context.syllabus_file else 'no'}\n\n"
        f"Policy chunks:\n{json.dumps(policy_payload, indent=2)}"
    )


def _normalize_string_list(values: object) -> list[str]:
    if not isinstance(values, list):
        return []

    normalized: list[str] = []

    for item in values:
        if isinstance(item, str):
            cleaned = item.strip()
            if cleaned:
                normalized.append(cleaned)
            continue

        if isinstance(item, dict):
            section_title = str(item.get("section_title", "")).strip()
            snippet = str(item.get("snippet", "")).strip()
            if section_title and snippet:
                normalized.append(f"{section_title}: {snippet}")
            elif snippet:
                normalized.append(snippet)

    return normalized


def _normalize_policy_chunks(
    values: object,
    fallback: list[PolicyChunk],
) -> list[PolicyChunk]:
    if not isinstance(values, list):
        return fallback

    normalized: list[PolicyChunk] = []

    for item in values:
        if not isinstance(item, dict):
            continue

        try:
            normalized.append(PolicyChunk(**item))
        except Exception:
            continue

    return normalized or fallback


def _pick_allowed_string(value: object, allowed: set[str], fallback: str) -> str:
    if not isinstance(value, str):
        return fallback

    cleaned = value.strip()
    if cleaned in allowed:
        return cleaned

    return fallback


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


def classify_submission(
    submission: CheckSubmission,
    policy_chunks: list[PolicyChunk],
    check_id: str | None = None,
) -> CheckResult:
    fallback_result = build_mock_result(
        submission=submission,
        policy_chunks=policy_chunks,
        check_id=check_id,
    )
    prompt = _build_prompt(submission, policy_chunks)

    try:
        response = kimi_client.analyze(
            prompt,
            context={
                "course_code": submission.context.course_code,
                "assignment_type": submission.context.assignment_type,
            },
        )
        payload = json.loads(str(response.get("content", "")).strip())
        safer_next_steps = (
            payload.get("safer_next_steps")
            or payload.get("safe_next_steps")
            or payload.get("safter_steps")
        )

        return CheckResult(
            id=fallback_result.id,
            summary=payload.get("summary") or fallback_result.summary,
            suspected_course=payload.get("suspected_course")
            or fallback_result.suspected_course,
            classification=_pick_allowed_string(
                payload.get("classification"),
                VALID_CLASSIFICATIONS,
                fallback_result.classification,
            ),
            risk_level=_pick_allowed_string(
                payload.get("risk_level"),
                VALID_RISK_LEVELS,
                fallback_result.risk_level,
            ),
            status="completed",
            reasoning=_normalize_string_list(payload.get("reasoning"))
            or fallback_result.reasoning,
            matched_policies=_normalize_policy_chunks(
                payload.get("matched_policies"),
                fallback_result.matched_policies,
            ),
            safer_next_steps=_normalize_string_list(safer_next_steps)
            or fallback_result.safer_next_steps,
            created_at=fallback_result.created_at,
            updated_at=fallback_result.updated_at,
        )
    except Exception:
        return fallback_result
