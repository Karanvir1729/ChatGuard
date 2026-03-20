import mockAnalysis from "../data/mockAnalysis";
import mockHistory from "../data/mockHistory";

const checksById = new Map([
  [
    mockAnalysis.id,
    {
      ...mockAnalysis,
      flags: [...mockAnalysis.flags],
      recommendations: [...mockAnalysis.recommendations],
      policySignals: { ...mockAnalysis.policySignals }
    }
  ]
]);

function wait(value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), 120);
  });
}

function cloneAnalysis(analysis) {
  return {
    ...analysis,
    flags: [...(analysis.flags || [])],
    recommendations: [...(analysis.recommendations || [])],
    policySignals: { ...(analysis.policySignals || {}) }
  };
}

function upsertHistoryItem(nextItem) {
  const existingIndex = mockHistory.findIndex((item) => item.id === nextItem.id);

  if (existingIndex >= 0) {
    mockHistory.splice(existingIndex, 1);
  }

  mockHistory.unshift(nextItem);
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

export async function uploadConversationFile(file) {
  return wait(buildStoredFile(file, "conversation"));
}

export async function uploadSyllabusFile(file) {
  return wait(buildStoredFile(file, "syllabus"));
}

export async function saveDraft(payload = {}) {
  const id = `draft-${Date.now()}`;
  const draftRecord = {
    id,
    title: payload.assignmentType || "Saved Draft",
    courseCode: payload.courseCode || "TBD000",
    status: "draft",
    verdict: "draft",
    updatedAt: new Date().toISOString()
  };

  upsertHistoryItem(draftRecord);

  return wait({ ...draftRecord });
}

export async function submitCheck(payload = {}) {
  const id = "mock-check-001";
  const submittedAnalysis = {
    ...cloneAnalysis(mockAnalysis),
    id,
    institution: payload.institution || mockAnalysis.institution,
    courseCode: payload.courseCode || mockAnalysis.courseCode,
    assignmentTitle: payload.assignmentType || mockAnalysis.assignmentTitle,
    submissionType: payload.assignmentType || mockAnalysis.submissionType,
    updatedAt: new Date().toISOString()
  };

  checksById.set(id, submittedAnalysis);
  upsertHistoryItem({
    id,
    title: payload.assignmentType || mockAnalysis.assignmentTitle,
    courseCode: payload.courseCode || mockAnalysis.courseCode,
    status: "completed",
    verdict: submittedAnalysis.verdict,
    updatedAt: submittedAnalysis.updatedAt
  });

  return wait(cloneAnalysis(submittedAnalysis));
}

export async function getCheckById(id) {
  const storedAnalysis = checksById.get(id);

  if (storedAnalysis) {
    return wait(cloneAnalysis(storedAnalysis));
  }

  return wait(
    cloneAnalysis({
      ...mockAnalysis,
      id
    })
  );
}

export async function getHistory() {
  return wait(mockHistory.map((item) => ({ ...item })));
}
