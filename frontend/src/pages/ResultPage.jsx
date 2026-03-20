import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import PolicyMatchList from "../components/PolicyMatchList";
import PrimaryButton from "../components/PrimaryButton";
import ReasoningList from "../components/ReasoningList";
import SaferNextSteps from "../components/SaferNextSteps";
import SecondaryButton from "../components/SecondaryButton";
import StatusBadge from "../components/StatusBadge";
import TopProgress from "../components/TopProgress";
import VerdictCard from "../components/VerdictCard";
import mockAnalysis from "../data/mockAnalysis";

function formatClassification(verdict) {
  return String(verdict || "")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getBadgeVariant(verdict) {
  switch (verdict) {
    case "allowed_with_advisory":
      return "allowedWithAdvisory";
    case "likely_allowed":
      return "likelyAllowed";
    case "needs_caution":
      return "needsCaution";
    case "high_risk":
      return "highRisk";
    default:
      return "draft";
  }
}

function getRiskProfile(riskScore) {
  if (riskScore >= 0.75) {
    return `High (${riskScore.toFixed(2)})`;
  }

  if (riskScore >= 0.45) {
    return `Moderate (${riskScore.toFixed(2)})`;
  }

  return `Minimal (${riskScore.toFixed(2)})`;
}

function ResultPage() {
  const navigate = useNavigate();
  const classification = formatClassification(mockAnalysis.verdict);
  const riskProfile = getRiskProfile(mockAnalysis.riskScore);
  const badgeVariant = getBadgeVariant(mockAnalysis.verdict);
  const policyItems = [
    {
      courseCode: mockAnalysis.courseCode,
      sectionTitle: "Permitted AI Support",
      snippet:
        "Brainstorming, outlining, and language revision may be acceptable when the final submission still reflects the student’s own judgment and course understanding."
    },
    {
      courseCode: mockAnalysis.courseCode,
      sectionTitle: "Student Responsibility",
      snippet:
        "Students remain responsible for verifying course-specific references, citations, and any claims carried forward from an AI-assisted draft."
    }
  ];

  return (
    <PageShell>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <TopProgress currentStep={4} />

        <section
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px"
          }}
        >
          <div style={{ maxWidth: "760px" }}>
            <p
              style={{
                margin: 0,
                color: "#6a6a6a",
                fontSize: "0.76rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              }}
            >
              Analysis ID: {mockAnalysis.id}
            </p>
            <h1
              style={{
                margin: "12px 0 8px",
                color: "#111111",
                fontSize: "2rem",
                lineHeight: 1.08
              }}
            >
              Final Analysis
            </h1>
            <p
              style={{
                margin: 0,
                color: "#5d5d5d",
                fontSize: "0.92rem",
                lineHeight: 1.55
              }}
            >
              This result is meant to help you make a safer academic decision
              before submission. It is advisory and should still be checked
              against the course policy and instructor guidance.
            </p>
          </div>

          <StatusBadge variant={badgeVariant}>{classification}</StatusBadge>
        </section>

        <VerdictCard
          classification={classification}
          riskLevel={riskProfile}
          summary={mockAnalysis.summary}
          suspectedCourse={`${mockAnalysis.courseCode} ${mockAnalysis.courseName}`}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <section style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p
              style={{
                margin: 0,
                color: "#6a6a6a",
                fontSize: "0.76rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              }}
            >
              Reasoning Behind Verdict
            </p>
            <ReasoningList reasons={mockAnalysis.flags} />
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p
              style={{
                margin: 0,
                color: "#6a6a6a",
                fontSize: "0.76rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              }}
            >
              Matched Policies
            </p>
            <PolicyMatchList items={policyItems} />
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p
              style={{
                margin: 0,
                color: "#6a6a6a",
                fontSize: "0.76rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              }}
            >
              Safer Next Steps
            </p>
            <SaferNextSteps steps={mockAnalysis.recommendations} />
          </section>
        </div>

        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            paddingTop: "4px"
          }}
        >
          <SecondaryButton onClick={() => navigate("/check/start")}>
            Start New Check
          </SecondaryButton>

          <PrimaryButton>Save Result</PrimaryButton>
        </section>
      </div>
    </PageShell>
  );
}

export default ResultPage;
