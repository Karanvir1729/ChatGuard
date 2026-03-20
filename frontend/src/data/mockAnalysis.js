const mockAnalysis = {
  id: "chk_1024",
  status: "completed",
  createdAt: "2026-03-20T10:15:00-04:00",
  updatedAt: "2026-03-20T10:19:00-04:00",
  institution: "University of Toronto",
  courseCode: "EDS345",
  courseName: "Policy, Ethics, and Digital Society",
  assignmentTitle: "Reflection Memo 2",
  submissionType: "Short written reflection",
  verdict: "allowed_with_advisory",
  riskScore: 0.32,
  summary:
    "The conversation appears to support brainstorming, outlining, and language cleanup. The final submission would still need clear student-authored judgment and course-specific examples.",
  flags: [
    "The model suggests structure and phrasing for core reflection points.",
    "The conversation does not show direct generation of a full final paper.",
    "Course-specific references should be verified by the student before submission."
  ],
  recommendations: [
    "Rewrite the final reflection in your own voice before submitting.",
    "Add course lecture references and personal analysis directly from your notes.",
    "Disclose AI assistance if the course policy requires it."
  ],
  policySignals: {
    brainstorming: "allowed",
    editingSupport: "allowed",
    directAnswerGeneration: "caution",
    citationReliability: "caution"
  }
};

export default mockAnalysis;
