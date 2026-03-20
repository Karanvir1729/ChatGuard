import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatUploadBox from "../components/ChatUploadBox";
import CheckboxField from "../components/CheckboxField";
import PageShell from "../components/PageShell";
import PrimaryButton from "../components/PrimaryButton";
import SectionCard from "../components/SectionCard";
import TopProgress from "../components/TopProgress";

function StartCheckPage() {
  const navigate = useNavigate();
  const uploadContainerRef = useRef(null);
  const [hasInput, setHasInput] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const evaluateInputState = () => {
    const container = uploadContainerRef.current;

    if (!container) {
      setHasInput(false);
      return;
    }

    const textarea = container.querySelector("textarea");
    const fileInput = container.querySelector('input[type="file"]');
    const hasText = Boolean(textarea?.value.trim());
    const hasFile = Boolean(fileInput?.files?.length);

    setHasInput(hasText || hasFile);
  };

  const syncAfterInteraction = () => {
    window.requestAnimationFrame(evaluateInputState);
  };

  const handleContinue = () => {
    if (!hasInput || !isConfirmed) {
      return;
    }

    navigate("/check/context");
  };

  const isContinueDisabled = !hasInput || !isConfirmed;

  return (
    <PageShell>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <TopProgress currentStep={1} />

        <section style={{ maxWidth: "760px" }}>
          <h1
            style={{
              margin: 0,
              color: "#111111",
              fontSize: "2rem",
              lineHeight: 1.08
            }}
          >
            Start a New Check
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              color: "#5d5d5d",
              fontSize: "0.92rem",
              lineHeight: 1.5
            }}
          >
            Paste the conversation you want reviewed, optionally attach a text
            transcript, and confirm that the material is complete.
          </p>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 300px",
            gap: "20px",
            alignItems: "start"
          }}
        >
          <div
            onChangeCapture={syncAfterInteraction}
            onClickCapture={syncAfterInteraction}
            onInputCapture={syncAfterInteraction}
            ref={uploadContainerRef}
          >
            <ChatUploadBox />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <SectionCard
              description="A little context makes the review more reliable."
              title="Pro Tips"
            >
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  color: "#555555",
                  fontSize: "0.86rem",
                  lineHeight: 1.55
                }}
              >
                <li>Include the full exchange, not just selected excerpts.</li>
                <li>Add follow-up prompts if they shaped the final submission.</li>
                <li>Use a plain text transcript when the chat is long.</li>
              </ul>
            </SectionCard>

            <SectionCard
              description="The verdict depends on both the conversation and the class context."
              title="Why is this important?"
            >
              <p
                style={{
                  margin: 0,
                  color: "#555555",
                  fontSize: "0.86rem",
                  lineHeight: 1.6
                }}
              >
                ChatGuard helps you spot risk before submission by reviewing how
                AI was used and whether that use still seems compatible with
                course expectations.
              </p>
            </SectionCard>
          </div>
        </div>

        <section
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "20px",
            paddingTop: "4px"
          }}
        >
          <div style={{ maxWidth: "620px" }}>
            <CheckboxField
              checked={isConfirmed}
              helperText="Confirm that the conversation is complete and ready for review."
              label="I confirm this conversation is complete and belongs to the submission I want checked."
              onChange={(event) => setIsConfirmed(event.target.checked)}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "8px"
            }}
          >
            <PrimaryButton
              disabled={isContinueDisabled}
              onClick={handleContinue}
            >
              Continue
            </PrimaryButton>
            <p
              style={{
                margin: 0,
                color: "#6a6a6a",
                fontSize: "0.78rem",
                lineHeight: 1.4
              }}
            >
              {isContinueDisabled
                ? "Add conversation input and confirm before continuing."
                : "Ready to add course context."}
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default StartCheckPage;
