import { useId, useRef, useState } from "react";
import SecondaryButton from "./SecondaryButton";

function UploadDropzone({
  label,
  helperText,
  onFileChange,
  accept,
  disabled = false,
  id: providedId
}) {
  const generatedId = useId();
  const inputId = providedId ?? generatedId;
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSelect = (event) => {
    const nextFile = event.target.files?.[0] ?? null;
    setSelectedFile(nextFile);

    if (onFileChange) {
      onFileChange(nextFile);
    }
  };

  const handleOpen = () => {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  };

  const handleRemove = () => {
    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (onFileChange) {
      onFileChange(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%"
      }}
    >
      <label
        htmlFor={inputId}
        style={{
          color: "#1a1a1a",
          fontSize: "0.84rem",
          fontWeight: 600
        }}
      >
        {label}
      </label>

      <input
        accept={accept}
        disabled={disabled}
        id={inputId}
        onChange={handleSelect}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
      />

      <button
        disabled={disabled}
        onClick={handleOpen}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          minHeight: "132px",
          padding: "20px",
          border: "1px solid #c9c9c9",
          background: "#f6f6f6",
          color: "#2f2f2f",
          cursor: disabled ? "not-allowed" : "pointer"
        }}
        type="button"
      >
        <span
          aria-hidden="true"
          style={{
            width: "28px",
            height: "28px",
            border: "1px solid #b8b8b8",
            borderRadius: "50%",
            background: "#e2e2e2"
          }}
        />
        <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
          {selectedFile ? "File selected" : "Choose a file to upload"}
        </span>
        <span style={{ color: "#6a6a6a", fontSize: "0.78rem" }}>
          {selectedFile ? selectedFile.name : "Click to browse from your device"}
        </span>
      </button>

      {helperText ? (
        <p
          style={{
            color: "#6a6a6a",
            fontSize: "0.78rem",
            lineHeight: 1.4
          }}
        >
          {helperText}
        </p>
      ) : null}

      {selectedFile ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            padding: "12px 14px",
            border: "1px solid #d4d4d4",
            background: "#ffffff"
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                color: "#1a1a1a",
                fontSize: "0.9rem",
                fontWeight: 600
              }}
            >
              {selectedFile.name}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <SecondaryButton disabled={disabled} onClick={handleOpen}>
              Replace
            </SecondaryButton>
            <SecondaryButton disabled={disabled} onClick={handleRemove}>
              Remove
            </SecondaryButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default UploadDropzone;
