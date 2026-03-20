# AI GENERATED FILE

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class CourseContext(BaseModel):
    institution: str = ""
    course_code: str = ""
    is_uoft_student: bool = False
    assignment_type: str = ""
    student_status: str = ""
    syllabus_file: str | None = None


class CheckSubmission(BaseModel):
    conversation_text: str = ""
    conversation_file: str | None = None
    confirmation_checked: bool = False
    context: CourseContext = Field(default_factory=CourseContext)


class PolicyChunk(BaseModel):
    course_code: str
    section_title: str
    snippet: str


class CheckResult(BaseModel):
    id: str
    summary: str
    suspected_course: str
    classification: str
    risk_level: str
    status: Literal["draft", "completed"] = "completed"
    reasoning: list[str] = Field(default_factory=list)
    matched_policies: list[PolicyChunk] = Field(default_factory=list)
    safer_next_steps: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class HistoryItem(BaseModel):
    id: str
    title: str
    course_code: str
    status: Literal["draft", "completed"]
    decision: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)
