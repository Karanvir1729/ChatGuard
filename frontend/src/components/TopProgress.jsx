const steps = [
  "Paste Conversation",
  "Add Course Context",
  "Review",
  "Final Analysis"
];

function TopProgress({ currentStep = 1 }) {
  return (
    <nav
      aria-label="Check progress"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "12px",
        marginBottom: "24px"
      }}
    >
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;

        return (
          <div
            key={label}
            style={{
              border: `1px solid ${
                isActive || isComplete ? "#808080" : "#d0d0d0"
              }`,
              background: isActive ? "#2a2a2a" : isComplete ? "#e5e5e5" : "#fafafa",
              color: isActive ? "#f3f3f3" : "#2c2c2c",
              padding: "12px 14px"
            }}
          >
            <div
              style={{
                marginBottom: "6px",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: isActive ? "#e7e7e7" : "#6a6a6a"
              }}
            >
              Step {stepNumber}
            </div>
            <div
              style={{
                fontSize: "0.88rem",
                fontWeight: 600,
                lineHeight: 1.35
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export default TopProgress;
