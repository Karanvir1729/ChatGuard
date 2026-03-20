// AI GENERATED FILE

export const buttonBaseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "40px",
  minWidth: "112px",
  padding: "0 16px",
  borderWidth: "1px",
  borderStyle: "solid",
  fontSize: "0.9rem",
  fontWeight: 600,
  lineHeight: 1,
  whiteSpace: "nowrap"
};

export const buttonContentStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px"
};

export const buttonDisabledStyle = {
  cursor: "not-allowed",
  opacity: 0.62
};

function PrimaryButton({
  children,
  onClick,
  disabled = false,
  loading = false
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      aria-busy={loading}
      disabled={isDisabled}
      onClick={onClick}
      style={{
        ...buttonBaseStyle,
        background: "#1f1f1f",
        borderColor: "#1f1f1f",
        color: "#f4f4f4",
        cursor: isDisabled ? buttonDisabledStyle.cursor : "pointer",
        opacity: isDisabled ? buttonDisabledStyle.opacity : 1
      }}
      type="button"
    >
      <span style={buttonContentStyle}>
        {loading ? "Loading..." : children}
      </span>
    </button>
  );
}

export default PrimaryButton;
