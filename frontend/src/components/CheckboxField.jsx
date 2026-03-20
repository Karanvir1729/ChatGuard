// AI GENERATED FILE

import { useId } from "react";

function CheckboxField({
  label,
  helperText,
  id: providedId,
  checked,
  onChange,
  disabled = false,
  ...inputProps
}) {
  const generatedId = useId();
  const checkboxId = providedId ?? generatedId;

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
        htmlFor={checkboxId}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          color: "#1a1a1a",
          cursor: disabled ? "not-allowed" : "pointer"
        }}
      >
        <input
          {...inputProps}
          checked={checked}
          disabled={disabled}
          id={checkboxId}
          onChange={onChange}
          style={{
            width: "16px",
            height: "16px",
            margin: "2px 0 0",
            accentColor: "#222222",
            flexShrink: 0
          }}
          type="checkbox"
        />

        <span
          style={{
            fontSize: "0.9rem",
            fontWeight: 500,
            lineHeight: 1.4
          }}
        >
          {label}
        </span>
      </label>

      {helperText ? (
        <p
          style={{
            paddingLeft: "26px",
            color: "#6a6a6a",
            fontSize: "0.78rem",
            lineHeight: 1.4
          }}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default CheckboxField;
