// AI GENERATED FILE

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckboxField from "../components/CheckboxField";
import PageShell from "../components/PageShell";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import SectionCard from "../components/SectionCard";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/TextInput";
import TopProgress from "../components/TopProgress";
import { uploadSyllabusFile } from "../lib/api";
import { useCheckFlow } from "../lib/checkFlowContext";

const assignmentTypes = [
  "Essay",
  "Research paper",
  "Coding assignment",
  "Problem set",
  "Lab report",
  "Presentation"
];

const studentStatuses = [
  "Undergraduate",
  "Graduate",
  "Continuing education"
];

function CourseContextPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { flowState, updateFlowState } = useCheckFlow();
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const updateField = (field, value) => {
    updateFlowState({
      [field]: value
    });
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      return;
    }

    setIsUploadingFile(true);

    uploadSyllabusFile(nextFile)
      .then((uploadedFile) => {
        updateField("syllabusFile", uploadedFile);
      })
      .finally(() => {
        setIsUploadingFile(false);
      });
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    updateField("syllabusFile", null);
  };

  return (
    <PageShell>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <TopProgress currentStep={2} />

        <section style={{ maxWidth: "760px" }}>
          <h1
            style={{
              margin: 0,
              color: "#111111",
              fontSize: "2rem",
              lineHeight: 1.08
            }}
          >
            Add Course Context
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              color: "#5d5d5d",
              fontSize: "0.92rem",
              lineHeight: 1.5
            }}
          >
            Add the course and assignment details that help frame how the AI
            conversation should be interpreted.
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
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <SectionCard
              description="Provide the school and course details tied to this submission."
              title="Educational Institution"
            >
              <div style={{ display: "grid", gap: "16px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) 180px",
                    gap: "16px"
                  }}
                >
                  <TextInput
                    helperText="School or institution name."
                    label="Institution"
                    onChange={(event) =>
                      updateField("institution", event.target.value)
                    }
                    placeholder="University of Toronto"
                    value={flowState.institution}
                  />

                  <TextInput
                    helperText="Course code."
                    label="Course Code"
                    onChange={(event) =>
                      updateField("courseCode", event.target.value)
                    }
                    placeholder="EDS345"
                    value={flowState.courseCode}
                  />
                </div>

                <CheckboxField
                  checked={flowState.isUofTStudent}
                  helperText="Check this if the course is being taken as a University of Toronto student."
                  label="I am a University of Toronto student"
                  onChange={(event) =>
                    updateField("isUofTStudent", event.target.checked)
                  }
                />
              </div>
            </SectionCard>

            <SectionCard
              description="Capture the assignment format and current student status."
              title="Assignment & Status"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "16px"
                }}
              >
                <SelectInput
                  helperText="Assignment format."
                  label="Assignment Type"
                  onChange={(event) =>
                    updateField("assignmentType", event.target.value)
                  }
                  options={assignmentTypes}
                  placeholder="Select assignment type"
                  value={flowState.assignmentType}
                />

                <SelectInput
                  helperText="Current student status."
                  label="Student Status"
                  onChange={(event) =>
                    updateField("studentStatus", event.target.value)
                  }
                  options={studentStatuses}
                  placeholder="Select student status"
                  value={flowState.studentStatus}
                />
              </div>
            </SectionCard>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <SectionCard
              description="Course rules often change what is acceptable AI use."
              title="Why context matters"
            >
              <p
                style={{
                  margin: 0,
                  color: "#565656",
                  fontSize: "0.86rem",
                  lineHeight: 1.6
                }}
              >
                The same conversation can be fine in one course and risky in
                another. Institution, assignment type, and student status help
                the review stay grounded in the right academic context.
              </p>
            </SectionCard>

            <SectionCard
              description="Upload a syllabus or assignment policy if you have one."
              title="Syllabus Upload"
            >
              <input
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
                type="file"
              />

              <button
                onClick={handleOpenFilePicker}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  minHeight: "148px",
                  padding: "18px",
                  border: "1px solid #cfcfcf",
                  background: "#f5f5f5",
                  color: "#232323",
                  cursor: "pointer"
                }}
                type="button"
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "1px solid #bbbbbb",
                    borderRadius: "50%",
                    background: "#e3e3e3"
                  }}
                />
                <span
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    lineHeight: 1.35
                  }}
                >
                  {flowState.syllabusFile ? "File selected" : "Choose syllabus file"}
                </span>
                <span
                  style={{
                    color: "#666666",
                    fontSize: "0.78rem",
                    lineHeight: 1.45,
                    textAlign: "center"
                  }}
                >
                  {flowState.syllabusFile
                    ? flowState.syllabusFile.name
                    : "PDF, DOC, DOCX, or TXT"}
                </span>
              </button>

              {flowState.syllabusFile ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginTop: "14px",
                    padding: "12px",
                    border: "1px solid #d8d8d8",
                    background: "#fbfbfb"
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#111111",
                      fontSize: "0.86rem",
                    fontWeight: 600
                    }}
                  >
                    {flowState.syllabusFile.name}
                  </p>

                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <SecondaryButton
                      disabled={isUploadingFile}
                      loading={isUploadingFile}
                      onClick={handleOpenFilePicker}
                    >
                      Replace
                    </SecondaryButton>
                    <SecondaryButton onClick={handleRemoveFile}>
                      Remove
                    </SecondaryButton>
                  </div>
                </div>
              ) : null}
            </SectionCard>
          </div>
        </div>

        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <SecondaryButton onClick={() => navigate("/check/start")}>
            Back
          </SecondaryButton>

          <PrimaryButton onClick={() => navigate("/check/review")}>
            Continue
          </PrimaryButton>
        </section>
      </div>
    </PageShell>
  );
}

export default CourseContextPage;
