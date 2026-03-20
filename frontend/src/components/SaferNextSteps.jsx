// AI GENERATED FILE

function SaferNextSteps({ steps = [] }) {
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
        Safer Next Steps
      </h2>

      <ul
        style={{
          margin: "16px 0 0",
          paddingLeft: "18px",
          color: "#333333",
          fontSize: "0.9rem",
          lineHeight: 1.65
        }}
      >
        {steps.map((step, index) => (
          <li key={`${index}-${step}`}>{step}</li>
        ))}
      </ul>
    </section>
  );
}

export default SaferNextSteps;
