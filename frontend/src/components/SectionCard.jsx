// AI GENERATED FILE

function SectionCard({ title, description, action, children }) {
  return (
    <section
      style={{
        border: "1px solid #c9c9c9",
        background: "#ffffff",
        padding: "20px"
      }}
    >
      {title || description || action ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: children ? "18px" : 0
          }}
        >
          <div>
            {title ? (
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
            ) : null}

            {description ? (
              <p
                style={{
                  marginTop: title ? "6px" : 0,
                  color: "#666666",
                  fontSize: "0.86rem",
                  lineHeight: 1.45
                }}
              >
                {description}
              </p>
            ) : null}
          </div>

          {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
        </div>
      ) : null}

      {children}
    </section>
  );
}

export default SectionCard;
