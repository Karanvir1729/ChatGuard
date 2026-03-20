function ReasoningList({ reasons = [] }) {
  return (
    <section
      style={{
        border: "1px solid #c9c9c9",
        background: "#ffffff",
        padding: "20px"
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#111111",
          fontSize: "1rem",
          fontWeight: 600
        }}
      >
        Reasoning
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "16px"
        }}
      >
        {reasons.map((reason, index) => (
          <div
            key={`${index}-${reason}`}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "12px 0",
              borderTop: index === 0 ? "0" : "1px solid #e0e0e0"
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "18px",
                height: "18px",
                border: "1px solid #bdbdbd",
                background: "#ececec",
                flexShrink: 0
              }}
            />
            <p
              style={{
                margin: 0,
                color: "#333333",
                fontSize: "0.9rem",
                lineHeight: 1.55
              }}
            >
              {reason}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReasoningList;
