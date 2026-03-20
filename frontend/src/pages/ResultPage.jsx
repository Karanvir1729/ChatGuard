import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getCheckById } from "../lib/api";
import { useCheckFlow } from "../lib/checkFlowContext";

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
  const { id } = useParams();
  const { flowState, resetFlowState } = useCheckFlow();
  const [analysis, setAnalysis] = useState(mockAnalysis);

  useEffect(() => {
    let isActive = true;

    getCheckById(id || mockAnalysis.id).then((result) => {
      if (isActive) {
        setAnalysis(result);
      }
    });

    return () => {
      isActive = false;
    };
  }, [id]);

  const classification = formatClassification(analysis.verdict);
  const riskProfile = getRiskProfile(analysis.riskScore);
  const badgeVariant = getBadgeVariant(analysis.verdict);
  const suspectedCourseCode = flowState.courseCode || analysis.courseCode;
  const suspectedCourseLabel =
    flowState.courseCode || [analysis.courseCode, analysis.courseName].filter(Boolean).join(" ");
  const policyItems = [
    {
      courseCode: suspectedCourseCode,
      sectionTitle: "Permitted AI Support",
      snippet:
        "Brainstorming, outlining, and language revision may be acceptable when the final submission still reflects the student’s own judgment and course understanding."
    },
    {
      courseCode: suspectedCourseCode,
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
              Analysis ID: {id || analysis.id}
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
          summary={analysis.summary}
          suspectedCourse={suspectedCourseLabel}
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
            <ReasoningList reasons={analysis.flags} />
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
            <SaferNextSteps steps={analysis.recommendations} />
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
          <SecondaryButton
            onClick={() => {
              resetFlowState();
              navigate("/check/start");
            }}
          >
            Start New Check
          </SecondaryButton>

          <PrimaryButton onClick={() => navigate("/history")}>
            Save Result
          </PrimaryButton>
        </section>
      </div>
    </PageShell>
  );
}

export default ResultPage;
