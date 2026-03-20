from __future__ import annotations

from backend.app.schemas import PolicyChunk
from backend.app.services.parser import extract_policy_sections


def retrieve_policy_chunks(
    course_code: str,
    policy_text: str = "",
) -> list[PolicyChunk]:
    normalized_course_code = course_code.strip() or "Unknown course"
    parsed_sections = extract_policy_sections(policy_text) if policy_text else []

    if parsed_sections:
        return [
            PolicyChunk(
                course_code=normalized_course_code,
                section_title=section["title"] or "Policy Section",
                snippet=section["content"][:280],
            )
            for section in parsed_sections[:3]
        ]

    return [
        PolicyChunk(
            course_code=normalized_course_code,
            section_title="AI Use Guidance",
            snippet="Placeholder policy chunk for AI-assisted brainstorming, drafting, and revision review.",
        ),
        PolicyChunk(
            course_code=normalized_course_code,
            section_title="Academic Integrity",
            snippet="Placeholder policy chunk for academic integrity expectations and student responsibility.",
        ),
    ]
