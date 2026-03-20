from __future__ import annotations

import re


ACADEMIC_POLICY_KEYWORDS = (
    "academic integrity",
    "integrity",
    "artificial intelligence",
    "ai use",
    "generative ai",
    "language model",
    "unauthorized aid",
    "plagiarism",
    "course policy",
)


def normalize_policy_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def split_policy_sections(text: str) -> list[dict[str, str]]:
    lines = [line.strip() for line in text.splitlines()]
    sections: list[dict[str, str]] = []
    current_title = "General"
    current_lines: list[str] = []

    for line in lines:
        if not line:
            continue

        looks_like_heading = line.endswith(":") or (
            len(line) <= 80 and line == line.title()
        )

        if looks_like_heading and current_lines:
            sections.append(
                {
                    "title": current_title.rstrip(":"),
                    "content": normalize_policy_text(" ".join(current_lines)),
                }
            )
            current_title = line.rstrip(":")
            current_lines = []
            continue

        if looks_like_heading and not current_lines:
            current_title = line.rstrip(":")
            continue

        current_lines.append(line)

    if current_lines:
        sections.append(
            {
                "title": current_title.rstrip(":"),
                "content": normalize_policy_text(" ".join(current_lines)),
            }
        )

    return sections


def extract_policy_sections(text: str) -> list[dict[str, str]]:
    matched_sections: list[dict[str, str]] = []

    for section in split_policy_sections(text):
        haystack = f"{section['title']} {section['content']}".lower()
        if any(keyword in haystack for keyword in ACADEMIC_POLICY_KEYWORDS):
            matched_sections.append(section)

    return matched_sections
