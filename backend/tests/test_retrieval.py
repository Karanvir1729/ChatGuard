# AI GENERATED FILE

from backend.app.services.retrieval import retrieve_policy_chunks


def test_retrieve_policy_chunks_returns_policy_chunk_shape() -> None:
    policy_text = """
    Academic Integrity:
    Students must not submit AI-generated answers as their own work.

    AI Use Policy:
    Generative AI can be used for planning when disclosed and approved.
    """

    chunks = retrieve_policy_chunks(course_code="CSC108", policy_text=policy_text)

    assert chunks
    assert len(chunks) <= 3

    first_chunk = chunks[0]
    assert first_chunk.course_code == "CSC108"
    assert isinstance(first_chunk.section_title, str)
    assert isinstance(first_chunk.snippet, str)
    assert first_chunk.section_title
    assert first_chunk.snippet
