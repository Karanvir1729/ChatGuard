from backend.app.services.parser import extract_policy_sections


def test_extract_policy_sections_finds_ai_and_integrity_sections() -> None:
    policy_text = """
    Course Overview
    Weekly readings and discussion prompts.

    Academic Integrity:
    Students must submit original work and cite outside help.

    Use of Generative AI:
    AI may support brainstorming and outlining, but not final answer generation.

    Grading
    Attendance and participation matter.
    """

    sections = extract_policy_sections(policy_text)
    section_titles = [section["title"] for section in sections]

    assert len(sections) == 2
    assert "Academic Integrity" in section_titles
    assert "Use of Generative AI" in section_titles
