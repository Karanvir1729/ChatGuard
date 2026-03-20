// AI GENERATED FILE

const variantStyles = {
  draft: {
    label: "Draft",
    background: "#f4f4f4",
    borderColor: "#cbcbcb",
    color: "#505050"
  },
  likelyAllowed: {
    label: "Likely Allowed",
    background: "#ececec",
    borderColor: "#bdbdbd",
    color: "#202020"
  },
  allowedWithAdvisory: {
    label: "Allowed With Advisory",
    background: "#e4e4e4",
    borderColor: "#afafaf",
    color: "#1f1f1f"
  },
  needsCaution: {
    label: "Needs Caution",
    background: "#d8d8d8",
    borderColor: "#9a9a9a",
    color: "#1b1b1b"
  },
  highRisk: {
    label: "High Risk",
    background: "#2b2b2b",
    borderColor: "#2b2b2b",
    color: "#f4f4f4"
  }
};

function normalizeVariant(variant) {
  const normalized = String(variant || "draft")
    .replace(/\s+/g, "")
    .replace(/[-_]/g, "");

  switch (normalized.toLowerCase()) {
    case "likelyallowed":
      return "likelyAllowed";
    case "allowedwithadvisory":
      return "allowedWithAdvisory";
    case "needscaution":
      return "needsCaution";
    case "highrisk":
      return "highRisk";
    default:
      return "draft";
  }
}

function StatusBadge({ variant = "draft", children }) {
  const resolvedVariant = normalizeVariant(variant);
  const styles = variantStyles[resolvedVariant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: "30px",
        padding: "0 12px",
        border: `1px solid ${styles.borderColor}`,
        background: styles.background,
        color: styles.color,
        fontSize: "0.8rem",
        fontWeight: 600,
        lineHeight: 1
      }}
    >
      {children || styles.label}
    </span>
  );
}

export default StatusBadge;
