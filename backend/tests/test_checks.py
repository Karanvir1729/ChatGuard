# AI GENERATED FILE

from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_analyze_endpoint_returns_expected_shape() -> None:
    payload = {
        "conversation_text": "I used AI to help outline my essay and revise a draft.",
        "conversation_file": None,
        "confirmation_checked": True,
        "context": {
            "institution": "University of Toronto",
            "course_code": "ENG201",
            "is_uoft_student": True,
            "assignment_type": "Essay",
            "student_status": "Undergraduate",
            "syllabus_file": None,
        },
    }

    response = client.post("/checks/analyze", json=payload)

    assert response.status_code == 200
    data = response.json()

    assert data["id"].startswith("check-")
    assert data["suspected_course"] == "ENG201"
    assert data["status"] == "completed"
    assert isinstance(data["summary"], str)
    assert isinstance(data["classification"], str)
    assert isinstance(data["risk_level"], str)
    assert isinstance(data["reasoning"], list)
    assert isinstance(data["matched_policies"], list)
    assert isinstance(data["safer_next_steps"], list)
