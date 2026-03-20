// AI GENERATED FILE

function VerdictCard({
  summary,
  suspectedCourse,
  classification,
  riskLevel
}) {
  return (
    <section
      style={{
        border: "1px solid #c9c9c9",
        background: "#ffffff",
        padding: "20px"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#6a6a6a",
              fontSize: "0.76rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}
          >
            Verdict Summary
          </p>
          <p
            style={{
              margin: "10px 0 0",
              color: "#1a1a1a",
              fontSize: "0.92rem",
              lineHeight: 1.55
            }}
          >
            {summary}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "12px"
          }}
        >
          <div
            style={{
              padding: "12px",
              border: "1px solid #d5d5d5",
              background: "#fafafa"
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#6a6a6a",
                fontSize: "0.74rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }}
            >
              Suspected Course
            </p>
            <p
              style={{
                margin: "8px 0 0",
                color: "#111111",
                fontSize: "0.9rem",
                fontWeight: 600
              }}
            >
              {suspectedCourse}
            </p>
          </div>

          <div
            style={{
              padding: "12px",
              border: "1px solid #d5d5d5",
              background: "#fafafa"
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#6a6a6a",
                fontSize: "0.74rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }}
            >
              Classification
            </p>
            <p
              style={{
                margin: "8px 0 0",
                color: "#111111",
                fontSize: "0.9rem",
                fontWeight: 600
              }}
            >
              {classification}
            </p>
          </div>

          <div
            style={{
              padding: "12px",
              border: "1px solid #d5d5d5",
              background: "#fafafa"
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#6a6a6a",
                fontSize: "0.74rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }}
            >
              Risk Level
            </p>
            <p
              style={{
                margin: "8px 0 0",
                color: "#111111",
                fontSize: "0.9rem",
                fontWeight: 600
              }}
            >
              {riskLevel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerdictCard;
