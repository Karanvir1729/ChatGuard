// AI GENERATED FILE

import mockAnalysis from "../data/mockAnalysis";
import mockHistory from "../data/mockHistory";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

let historyCache = mockHistory.map((item) => normalizeHistoryItem(item));
const checksById = new Map([
  [mockAnalysis.id, cloneAnalysis(normalizeAnalysis(mockAnalysis))]
]);

function wait(value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), 120);
  });
}

function toLabel(value) {
  return String(value || "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getRiskLabelFromScore(score) {
  if (typeof score !== "number") {
    return "";
  }

  if (score >= 0.75) {
    return "High";
  }

  if (score >= 0.45) {
    return "Moderate";
  }

  return "Minimal";
}

function buildFallbackPolicyMatches(courseCode) {
  return [
    {
      courseCode,
      sectionTitle: "Permitted AI Support",
      snippet:
        "Brainstorming, outlining, and language revision may be acceptable when the final submission still reflects the student’s own judgment and course understanding."
    },
    {
      courseCode,
      sectionTitle: "Student Responsibility",
      snippet:
        "Students remain responsible for verifying citations, course references, and any claims carried forward from AI-assisted work."
    }
  ];
}

function normalizeAnalysis(analysis = {}) {
  const suspectedCourse =
    analysis.suspected_course ||
    analysis.suspectedCourse ||
    analysis.course_code ||
    analysis.courseCode ||
    mockAnalysis.courseCode;

  return {
    id: analysis.id || mockAnalysis.id,
    status: analysis.status || "completed",
    summary: analysis.summary || mockAnalysis.summary,
    suspectedCourse,
    classification:
      analysis.classification || toLabel(analysis.verdict) || "Needs Caution",
    riskLevel:
      analysis.risk_level ||
      analysis.riskLevel ||
      getRiskLabelFromScore(analysis.riskScore) ||
      "Moderate",
    reasoning: [...(analysis.reasoning || analysis.flags || mockAnalysis.flags)],
    matchedPolicies: [
      ...(
        analysis.matched_policies ||
        analysis.matchedPolicies ||
        buildFallbackPolicyMatches(suspectedCourse)
      )
    ].map((item) => ({
      courseCode: item.course_code || item.courseCode || suspectedCourse,
      sectionTitle: item.section_title || item.sectionTitle || "Policy Section",
      snippet: item.snippet || ""
    })),
    saferNextSteps: [
      ...(
        analysis.safer_next_steps ||
        analysis.saferNextSteps ||
        analysis.recommendations ||
        mockAnalysis.recommendations
      )
    ],
    createdAt: analysis.created_at || analysis.createdAt || mockAnalysis.createdAt,
    updatedAt: analysis.updated_at || analysis.updatedAt || mockAnalysis.updatedAt
  };
}

function cloneAnalysis(analysis) {
  return {
    ...analysis,
    reasoning: [...analysis.reasoning],
    matchedPolicies: analysis.matchedPolicies.map((item) => ({ ...item })),
    saferNextSteps: [...analysis.saferNextSteps]
  };
}

function normalizeHistoryItem(item = {}) {
  return {
    id: item.id || `history-${Date.now()}`,
    title: item.title || "Saved Check",
    courseCode: item.course_code || item.courseCode || "TBD000",
    status: item.status || "draft",
    decision: item.decision || toLabel(item.verdict) || "Draft",
    updatedAt: item.updated_at || item.updatedAt || new Date().toISOString()
  };
}

function cloneHistoryItem(item) {
  return { ...item };
}

function upsertHistoryItem(nextItem) {
  const existingIndex = historyCache.findIndex((item) => item.id === nextItem.id);

  if (existingIndex >= 0) {
    historyCache.splice(existingIndex, 1);
  }

  historyCache.unshift(cloneHistoryItem(nextItem));
}

function buildStoredFile(file, kind) {
  if (!file) {
    return null;
  }

  return {
    kind,
    name: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    originalFile: file
  };
}

function buildSubmissionPayload(payload = {}) {
  return {
    conversation_text: payload.conversationText || "",
    conversation_file: payload.conversationFile?.name || null,
    confirmation_checked: Boolean(payload.confirmationChecked),
    context: {
      institution: payload.institution || "",
      course_code: payload.courseCode || "",
      is_uoft_student: Boolean(payload.isUofTStudent),
      assignment_type: payload.assignmentType || "",
      student_status: payload.studentStatus || "",
      syllabus_file: payload.syllabusFile?.name || null
    }
  };
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

async function uploadFile(path, file, kind) {
  if (!file) {
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await requestJson(path, {
      method: "POST",
      body: formData
    });

    return {
      kind,
      name: response.original_filename || response.filename || file.name,
      storedName: response.filename || file.name,
      size: response.size || file.size,
      path: response.path || "",
      uploadedAt: new Date().toISOString(),
      originalFile: file
    };
  } catch {
    return wait(buildStoredFile(file, kind));
  }
}

export async function uploadConversationFile(file) {
  return uploadFile("/upload/conversation", file, "conversation");
}

export async function uploadSyllabusFile(file) {
  return uploadFile("/upload/syllabus", file, "syllabus");
}

export async function saveDraft(payload = {}) {
  try {
    const response = await requestJson("/checks/draft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildSubmissionPayload(payload))
    });
    const draft = normalizeHistoryItem(response);
    upsertHistoryItem(draft);
    return cloneHistoryItem(draft);
  } catch {
    const draft = normalizeHistoryItem({
      id: `draft-${Date.now()}`,
      title: payload.assignmentType || "Saved Draft",
      courseCode: payload.courseCode || "TBD000",
      status: "draft",
      decision: "Draft",
      updatedAt: new Date().toISOString()
    });
    upsertHistoryItem(draft);
    return wait(cloneHistoryItem(draft));
  }
}

export async function submitCheck(payload = {}) {
  try {
    const response = await requestJson("/checks/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildSubmissionPayload(payload))
    });
    const result = normalizeAnalysis(response);
    checksById.set(result.id, cloneAnalysis(result));
    upsertHistoryItem({
      id: result.id,
      title: payload.assignmentType || "Completed Check",
      courseCode: result.suspectedCourse,
      status: "completed",
      decision: result.classification,
      updatedAt: result.updatedAt
    });
    return cloneAnalysis(result);
  } catch {
    const result = normalizeAnalysis({
      ...mockAnalysis,
      id: "mock-check-001",
      courseCode: payload.courseCode || mockAnalysis.courseCode,
      assignmentTitle: payload.assignmentType || mockAnalysis.assignmentTitle,
      submissionType: payload.assignmentType || mockAnalysis.submissionType,
      updatedAt: new Date().toISOString()
    });
    checksById.set(result.id, cloneAnalysis(result));
    upsertHistoryItem({
      id: result.id,
      title: payload.assignmentType || "Completed Check",
      courseCode: result.suspectedCourse,
      status: "completed",
      decision: result.classification,
      updatedAt: result.updatedAt
    });
    return wait(cloneAnalysis(result));
  }
}

export async function getCheckById(id) {
  try {
    const response = await requestJson(`/checks/${id}`);
    const result = normalizeAnalysis(response);
    checksById.set(result.id, cloneAnalysis(result));
    return cloneAnalysis(result);
  } catch {
    const storedAnalysis = checksById.get(id);

    if (storedAnalysis) {
      return wait(cloneAnalysis(storedAnalysis));
    }

    return wait(
      cloneAnalysis(
        normalizeAnalysis({
          ...mockAnalysis,
          id
        })
      )
    );
  }
}

export async function getHistory() {
  try {
    const response = await requestJson("/history");
    historyCache = response.map((item) => normalizeHistoryItem(item));
    return historyCache.map((item) => cloneHistoryItem(item));
  } catch {
    return wait(historyCache.map((item) => cloneHistoryItem(item)));
  }
}
