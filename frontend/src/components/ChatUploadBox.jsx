// AI GENERATED FILE

import { useId, useRef, useState } from "react";
import SecondaryButton from "./SecondaryButton";
import SectionCard from "./SectionCard";

function ChatUploadBox() {
  const textareaId = useId();
  const fileInputId = useId();
  const fileInputRef = useRef(null);
  const [conversationText, setConversationText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [touched, setTouched] = useState(false);

  const hasConversation = conversationText.trim().length > 0;
  const hasFile = Boolean(selectedFile);
  const hasContent = hasConversation || hasFile;
  const validationMessage =
    touched && !hasContent
      ? "Paste a conversation or upload a text file to continue."
      : "";

  const handleTextChange = (event) => {
    setConversationText(event.target.value);
    setTouched(true);
  };

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0] ?? null;
    setSelectedFile(nextFile);
    setTouched(true);
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setTouched(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <SectionCard
      description="Paste the full AI conversation or optionally upload a plain text transcript."
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
            htmlFor={textareaId}
            style={{
              color: "#111111",
              fontSize: "0.84rem",
              fontWeight: 600
            }}
          >
            AI Conversation
          </label>

          <textarea
            id={textareaId}
            onBlur={() => setTouched(true)}
            onChange={handleTextChange}
            placeholder="Paste the full AI conversation here..."
            style={{
              minHeight: "320px",
              width: "100%",
              padding: "14px",
              border: `1px solid ${validationMessage ? "#9a9a9a" : "#c9c9c9"}`,
              background: "#fbfbfb",
              color: "#222222",
              resize: "vertical",
              outline: "none"
            }}
            value={conversationText}
          />

          <p
            style={{
              margin: 0,
              color: validationMessage ? "#4f4f4f" : "#6a6a6a",
              fontSize: "0.8rem",
              lineHeight: 1.45
            }}
          >
            {validationMessage || "Include the full exchange for the most accurate review."}
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
            htmlFor={fileInputId}
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
            id={fileInputId}
            onChange={handleFileChange}
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
                {selectedFile ? "Text file selected" : "Upload a transcript file"}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "#666666",
                  fontSize: "0.8rem",
                  lineHeight: 1.45
                }}
              >
                {selectedFile
                  ? selectedFile.name
                  : "Accepted format: plain text (.txt)"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <SecondaryButton onClick={handleOpenFilePicker}>
                {selectedFile ? "Replace File" : "Choose File"}
              </SecondaryButton>
              {selectedFile ? (
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
  );
}

export default ChatUploadBox;
