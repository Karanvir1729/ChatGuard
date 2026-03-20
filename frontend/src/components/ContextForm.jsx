import { useRef } from "react";
import CheckboxField from "./CheckboxField";
import SecondaryButton from "./SecondaryButton";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

export const assignmentTypeOptions = [
  "Essay",
  "Research paper",
  "Coding assignment",
  "Problem set",
  "Lab report",
  "Presentation"
];

export const studentStatusOptions = [
  "Undergraduate",
  "Graduate",
  "Continuing education"
];

export const defaultContextFormValues = {
  institution: "",
  courseCode: "",
  isUofTStudent: false,
  assignmentType: "",
  studentStatus: "",
  syllabusFile: null
};

function ContextForm({
  value = defaultContextFormValues,
  onChange,
  errors = {},
  disabled = false
}) {
  const fileInputRef = useRef(null);
  const formValue = {
    ...defaultContextFormValues,
    ...value
  };

  const updateField = (field, nextValue) => {
    if (!onChange) {
      return;
    }

    onChange({
      ...formValue,
      [field]: nextValue
    });
  };

  const handleFileSelect = (event) => {
    const nextFile = event.target.files?.[0] ?? null;
    updateField("syllabusFile", nextFile);
  };

  const handleReplaceFile = () => {
    if (disabled) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    updateField("syllabusFile", null);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 280px",
        gap: "20px",
        alignItems: "start"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          padding: "20px",
          border: "1px solid #cfcfcf",
          background: "#ffffff"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 180px",
            gap: "16px"
          }}
        >
          <TextInput
            disabled={disabled}
            error={errors.institution}
            helperText={!errors.institution ? "School or institution name." : ""}
            label="Institution"
            onChange={(event) => updateField("institution", event.target.value)}
            placeholder="University of Toronto"
            value={formValue.institution}
          />

          <TextInput
            disabled={disabled}
            error={errors.courseCode}
            helperText={!errors.courseCode ? "Course code." : ""}
            label="Course Code"
            onChange={(event) => updateField("courseCode", event.target.value)}
            placeholder="EDS345"
            value={formValue.courseCode}
          />
        </div>

        <CheckboxField
          checked={formValue.isUofTStudent}
          disabled={disabled}
          helperText="Check this if you are currently enrolled as a University of Toronto student."
          label="I am a University of Toronto student"
          onChange={(event) =>
            updateField("isUofTStudent", event.target.checked)
          }
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "16px"
          }}
        >
          <SelectInput
            disabled={disabled}
            error={errors.assignmentType}
            helperText={!errors.assignmentType ? "Select the assignment format." : ""}
            label="Assignment Type"
            onChange={(event) =>
              updateField("assignmentType", event.target.value)
            }
            options={assignmentTypeOptions}
            placeholder="Select assignment type"
            value={formValue.assignmentType}
          />

          <SelectInput
            disabled={disabled}
            error={errors.studentStatus}
            helperText={!errors.studentStatus ? "Current student status." : ""}
            label="Student Status"
            onChange={(event) =>
              updateField("studentStatus", event.target.value)
            }
            options={studentStatusOptions}
            placeholder="Select student status"
            value={formValue.studentStatus}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "18px",
          border: "1px solid #cfcfcf",
          background: "#fbfbfb"
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: "#111111",
              fontSize: "0.98rem",
              fontWeight: 600
            }}
          >
            Syllabus File
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              color: "#666666",
              fontSize: "0.8rem",
              lineHeight: 1.45
            }}
          >
            Upload the course syllabus or assignment policy if available.
          </p>
        </div>

        <input
          accept=".pdf,.doc,.docx,.txt"
          disabled={disabled}
          onChange={handleFileSelect}
          ref={fileInputRef}
          style={{ display: "none" }}
          type="file"
        />

        <button
          disabled={disabled}
          onClick={handleReplaceFile}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            minHeight: "152px",
            padding: "18px",
            border: `1px solid ${errors.syllabusFile ? "#9a9a9a" : "#cdcdcd"}`,
            background: "#f3f3f3",
            color: "#232323",
            cursor: disabled ? "not-allowed" : "pointer"
          }}
          type="button"
        >
          <span
            aria-hidden="true"
            style={{
              width: "30px",
              height: "30px",
              border: "1px solid #bdbdbd",
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
            {formValue.syllabusFile ? "File selected" : "Upload syllabus"}
          </span>
          <span
            style={{
              color: "#666666",
              fontSize: "0.78rem",
              lineHeight: 1.45,
              textAlign: "center"
            }}
          >
            {formValue.syllabusFile
              ? formValue.syllabusFile.name
              : "PDF, DOC, DOCX, or TXT"}
          </span>
        </button>

        {errors.syllabusFile ? (
          <p
            style={{
              margin: 0,
              color: "#4f4f4f",
              fontSize: "0.78rem",
              lineHeight: 1.4
            }}
          >
            {errors.syllabusFile}
          </p>
        ) : null}

        {formValue.syllabusFile ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              padding: "12px",
              border: "1px solid #d6d6d6",
              background: "#ffffff"
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  color: "#111111",
                  fontSize: "0.88rem",
                  fontWeight: 600
                }}
              >
                {formValue.syllabusFile.name}
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <SecondaryButton disabled={disabled} onClick={handleReplaceFile}>
                Replace
              </SecondaryButton>
              <SecondaryButton disabled={disabled} onClick={handleRemoveFile}>
                Remove
              </SecondaryButton>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ContextForm;
