// AI GENERATED FILE

function EmptyState({ title, desc, action }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        minHeight: "220px",
        padding: "32px 24px",
        border: "1px solid #cfcfcf",
        background: "#f8f8f8",
        textAlign: "center"
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "42px",
          height: "42px",
          border: "1px solid #c3c3c3",
          background: "#e7e7e7"
        }}
      />

      <div>
        <h2
          style={{
            margin: 0,
            color: "#111111",
            fontSize: "1rem",
            fontWeight: 600
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: "8px 0 0",
            maxWidth: "420px",
            color: "#666666",
            fontSize: "0.88rem",
            lineHeight: 1.5
          }}
        >
          {desc}
        </p>
      </div>

      {action ? <div style={{ marginTop: "4px" }}>{action}</div> : null}
    </div>
  );
}

export default EmptyState;
