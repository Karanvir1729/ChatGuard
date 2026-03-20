// AI GENERATED FILE

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckboxField from "../components/CheckboxField";
import PageShell from "../components/PageShell";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import SectionCard from "../components/SectionCard";
import TopProgress from "../components/TopProgress";
import { uploadConversationFile } from "../lib/api";
import { useCheckFlow } from "../lib/checkFlowContext";

function StartCheckPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { flowState, updateFlowState } = useCheckFlow();
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const hasConversationInput = Boolean(
    flowState.conversationText.trim() || flowState.conversationFile
  );

  const handleFileSelect = async (event) => {
    const nextFile = event.target.files?.[0];

    if (!nextFile) {
      return;
    }

    setIsUploadingFile(true);

    try {
      const uploadedFile = await uploadConversationFile(nextFile);
      updateFlowState({
        conversationFile: uploadedFile
      });
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    updateFlowState({
      conversationFile: null
    });
  };

  const handleContinue = () => {
    if (!hasConversationInput || !flowState.confirmationChecked) {
      return;
    }

    navigate("/check/context");
  };

  const isContinueDisabled =
    !hasConversationInput || !flowState.confirmationChecked;

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
          <SectionCard
            description="Paste the full AI conversation or upload a plain text transcript."
            title="Paste Conversation"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 280px",
                gap: "18px",
                alignItems: "start"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                <label
                  htmlFor="conversationText"
                  style={{
                    color: "#111111",
                    fontSize: "0.84rem",
                    fontWeight: 600
                  }}
                >
                  AI Conversation
                </label>

                <textarea
                  id="conversationText"
                  onChange={(event) =>
                    updateFlowState({
                      conversationText: event.target.value
                    })
                  }
                  placeholder="Paste the full AI conversation here..."
                  style={{
                    minHeight: "320px",
                    width: "100%",
                    padding: "14px",
                    border: "1px solid #c9c9c9",
                    background: "#fbfbfb",
                    color: "#222222",
                    resize: "vertical",
                    outline: "none"
                  }}
                  value={flowState.conversationText}
                />

                <p
                  style={{
                    margin: 0,
                    color: "#6a6a6a",
                    fontSize: "0.8rem",
                    lineHeight: 1.45
                  }}
                >
                  Include the full exchange for a more reliable review.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                <label
                  htmlFor="conversationFile"
                  style={{
                    color: "#111111",
                    fontSize: "0.84rem",
                    fontWeight: 600
                  }}
                >
                  Optional Text File
                </label>

                <input
                  accept=".txt,text/plain"
                  id="conversationFile"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  type="file"
                />

                <div
                  style={{
                    border: "1px solid #cfcfcf",
                    background: "#f7f7f7",
                    padding: "18px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginBottom: "14px"
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "28px",
                        height: "28px",
                        border: "1px solid #bdbdbd",
                        background: "#e4e4e4"
                      }}
                    />
                    <p
                      style={{
                        margin: 0,
                        color: "#222222",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        lineHeight: 1.35
                      }}
                    >
                      {flowState.conversationFile
                        ? "Text file selected"
                        : "Upload a transcript file"}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#666666",
                        fontSize: "0.8rem",
                        lineHeight: 1.45
                      }}
                    >
                      {flowState.conversationFile
                        ? flowState.conversationFile.name
                        : "Accepted format: plain text (.txt)"}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <SecondaryButton
                      disabled={isUploadingFile}
                      loading={isUploadingFile}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {flowState.conversationFile ? "Replace File" : "Choose File"}
                    </SecondaryButton>
                    {flowState.conversationFile ? (
                      <SecondaryButton onClick={handleRemoveFile}>
                        Remove
                      </SecondaryButton>
                    ) : null}
                  </div>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "#6a6a6a",
                    fontSize: "0.78rem",
                    lineHeight: 1.45
                  }}
                >
                  Upload is optional. You can paste text, upload a file, or do both.
                </p>
              </div>
            </div>
          </SectionCard>

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
              checked={flowState.confirmationChecked}
              helperText="Confirm that the conversation is complete and ready for review."
              label="I confirm this conversation is complete and belongs to the submission I want checked."
              onChange={(event) =>
                updateFlowState({
                  confirmationChecked: event.target.checked
                })
              }
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
