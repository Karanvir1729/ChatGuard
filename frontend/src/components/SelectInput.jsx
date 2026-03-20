// AI GENERATED FILE

import { useId } from "react";

function SelectInput({
  label,
  options = [],
  helperText,
  error,
  id: providedId,
  placeholder,
  ...selectProps
}) {
  const generatedId = useId();
  const selectId = providedId ?? generatedId;
  const message = error || helperText;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%"
      }}
    >
      <label
        htmlFor={selectId}
        style={{
          color: "#1a1a1a",
          fontSize: "0.84rem",
          fontWeight: 600
        }}
      >
        {label}
      </label>

      <select
        {...selectProps}
        aria-invalid={Boolean(error)}
        id={selectId}
        style={{
          width: "100%",
          minHeight: "40px",
          padding: "0 12px",
          border: `1px solid ${error ? "#8e8e8e" : "#c9c9c9"}`,
          background: "#ffffff",
          color: "#1f1f1f",
          outline: "none"
        }}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => {
          const normalizedOption =
            typeof option === "string"
              ? { label: option, value: option }
              : option;

          return (
            <option key={normalizedOption.value} value={normalizedOption.value}>
              {normalizedOption.label}
            </option>
          );
        })}
      </select>

      {message ? (
        <p
          style={{
            color: error ? "#4f4f4f" : "#6a6a6a",
            fontSize: "0.78rem",
            lineHeight: 1.4
          }}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

export default SelectInput;
