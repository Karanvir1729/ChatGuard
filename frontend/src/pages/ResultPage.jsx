// AI GENERATED FILE

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import PageShell from "../components/PageShell";
import PolicyMatchList from "../components/PolicyMatchList";
import PrimaryButton from "../components/PrimaryButton";
import ReasoningList from "../components/ReasoningList";
import SaferNextSteps from "../components/SaferNextSteps";
import SecondaryButton from "../components/SecondaryButton";
import StatusBadge from "../components/StatusBadge";
import TopProgress from "../components/TopProgress";
import VerdictCard from "../components/VerdictCard";
import { getCheckById } from "../lib/api";
import { useCheckFlow } from "../lib/checkFlowContext";

function ResultPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { resetFlowState } = useCheckFlow();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);

    getCheckById(id || "mock-check-001")
      .then((result) => {
        if (isActive) {
          setAnalysis(result);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  return (
    <PageShell>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <TopProgress currentStep={4} />

        {isLoading && !analysis ? (
          <LoadingState label="Loading analysis" />
        ) : (
          <>
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
                  Analysis ID: {analysis?.id || id}
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
                  This result is meant to help you make a safer academic
                  decision before submission. It is advisory and should still
                  be checked against the course policy and instructor guidance.
                </p>
              </div>

              <StatusBadge
                variant={
                  analysis?.status === "draft"
                    ? "draft"
                    : analysis?.classification || "draft"
                }
              >
                {analysis?.classification || "Draft"}
              </StatusBadge>
            </section>

            <VerdictCard
              classification={analysis?.classification || "Draft"}
              riskLevel={analysis?.riskLevel || "Moderate"}
              summary={analysis?.summary || "No analysis available yet."}
              suspectedCourse={analysis?.suspectedCourse || "Unknown course"}
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
                <ReasoningList reasons={analysis?.reasoning || []} />
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
                <PolicyMatchList items={analysis?.matchedPolicies || []} />
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
                <SaferNextSteps steps={analysis?.saferNextSteps || []} />
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
          </>
        )}
      </div>
    </PageShell>
  );
}

export default ResultPage;
