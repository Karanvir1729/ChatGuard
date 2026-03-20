// AI GENERATED FILE

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import PrimaryButton from "../components/PrimaryButton";
import ReviewCard from "../components/ReviewCard";
import SecondaryButton from "../components/SecondaryButton";
import TopProgress from "../components/TopProgress";
import { saveDraft, submitCheck } from "../lib/api";
import { useCheckFlow } from "../lib/checkFlowContext";

function ReviewPage() {
  const navigate = useNavigate();
  const { flowState } = useCheckFlow();
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmittingCheck, setIsSubmittingCheck] = useState(false);
  const isBusy = isSavingDraft || isSubmittingCheck;

  const conversationPreview = flowState.conversationText.trim()
    ? flowState.conversationText.trim()
    : flowState.conversationFile
      ? `Conversation file uploaded: ${flowState.conversationFile.name}`
      : "No conversation has been added yet.";

  const previewText =
    conversationPreview.length > 420
      ? `${conversationPreview.slice(0, 420)}...`
      : conversationPreview;

  const courseSummaryItems = [
    { label: "Institution", value: flowState.institution || "Not provided" },
    { label: "Course Code", value: flowState.courseCode || "Not provided" },
    {
      label: "Assignment Type",
      value: flowState.assignmentType || "Not provided"
    },
    {
      label: "Student Status",
      value: flowState.studentStatus || "Not provided"
    }
  ];

  const handleSaveDraft = async () => {
    if (isBusy) {
      return;
    }

    setIsSavingDraft(true);

    try {
      await saveDraft(flowState);
      navigate("/history");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmitCheck = async () => {
    if (isBusy) {
      return;
    }

    setIsSubmittingCheck(true);

    try {
      const result = await submitCheck(flowState);
      navigate(`/check/result/${result.id}`);
    } finally {
      setIsSubmittingCheck(false);
    }
  };

  return (
    <PageShell>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <TopProgress currentStep={3} />

        <section style={{ maxWidth: "760px" }}>
          <h1
            style={{
              margin: 0,
              color: "#111111",
              fontSize: "2rem",
              lineHeight: 1.08
            }}
          >
            Review Submission
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              color: "#5d5d5d",
              fontSize: "0.92rem",
              lineHeight: 1.5
            }}
          >
            Confirm the conversation, course context, and uploaded material
            before running the final check.
          </p>
        </section>

        <section
          style={{
            border: "1px solid #c8c8c8",
            background: "#f6f6f6",
            padding: "16px 18px"
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#202020",
              fontSize: "0.86rem",
              fontWeight: 600
            }}
          >
            Official Rules Notice
          </p>
          <p
            style={{
              margin: "8px 0 0",
              color: "#5b5b5b",
              fontSize: "0.84rem",
              lineHeight: 1.55
            }}
          >
            Review this summary carefully before submission. ChatGuard can help
            identify potential risk, but final responsibility still depends on
            your course policy, instructor guidance, and the work you choose to
            submit.
          </p>
        </section>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <ReviewCard
            action={
              <SecondaryButton onClick={() => navigate("/check/start")}>
                Edit Conversation
              </SecondaryButton>
            }
            title="Conversation Preview"
          >
            <div
              style={{
                display: "grid",
                gap: "12px"
              }}
            >
              <div
                style={{
                  minHeight: "110px",
                  padding: "14px",
                  border: "1px solid #d4d4d4",
                  background: "#fbfbfb"
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#444444",
                    fontSize: "0.86rem",
                    lineHeight: 1.6
                  }}
                >
                  {previewText}
                </p>
              </div>
            </div>
          </ReviewCard>

          <ReviewCard
            action={
              <SecondaryButton onClick={() => navigate("/check/context")}>
                Edit Course Info
              </SecondaryButton>
            }
            title="Course Info Summary"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "12px"
              }}
            >
              {courseSummaryItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "12px",
                    border: "1px solid #d6d6d6",
                    background: "#fbfbfb"
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#6a6a6a",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase"
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#151515",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      lineHeight: 1.4
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </ReviewCard>

          <ReviewCard
            action={
              <SecondaryButton onClick={() => navigate("/check/context")}>
                Change File
              </SecondaryButton>
            }
            title="Additional Resource Uploaded"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                padding: "14px",
                border: "1px solid #d5d5d5",
                background: "#fbfbfb"
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#131313",
                    fontSize: "0.9rem",
                    fontWeight: 600
                  }}
                >
                  {flowState.syllabusFile
                    ? flowState.syllabusFile.name
                    : "No file uploaded"}
                </p>
                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#666666",
                    fontSize: "0.8rem",
                    lineHeight: 1.45
                  }}
                >
                  {flowState.syllabusFile
                    ? "Uploaded to provide policy and assignment context for the review."
                    : "You can continue without a syllabus file, but adding one may improve policy matching."}
                </p>
              </div>

              <div
                aria-hidden="true"
                style={{
                  width: "88px",
                  height: "56px",
                  border: "1px solid #c8c8c8",
                  background: "#d4d4d4",
                  flexShrink: 0
                }}
              />
            </div>
          </ReviewCard>
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
            disabled={isBusy}
            loading={isSavingDraft}
            onClick={handleSaveDraft}
          >
            Save as Draft
          </SecondaryButton>

          <PrimaryButton
            disabled={isBusy}
            loading={isSubmittingCheck}
            onClick={handleSubmitCheck}
          >
            Submit Check
          </PrimaryButton>
        </section>
      </div>
    </PageShell>
  );
}

export default ReviewPage;
