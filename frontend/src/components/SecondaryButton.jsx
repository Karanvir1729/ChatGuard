// AI GENERATED FILE

import {
  buttonBaseStyle,
  buttonContentStyle,
  buttonDisabledStyle
} from "./PrimaryButton";

function SecondaryButton({
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
        background: "#f6f6f6",
        borderColor: "#c8c8c8",
        color: "#222222",
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

export default SecondaryButton;
