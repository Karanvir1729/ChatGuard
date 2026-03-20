function LoadingState({ label = "Loading" }) {
  return (
    <div
      aria-live="polite"
      style={{
        border: "1px solid #cfcfcf",
        background: "#fbfbfb",
        padding: "20px"
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#555555",
          fontSize: "0.84rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em"
        }}
      >
        {label}
      </p>

      <div
        aria-hidden="true"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "16px"
        }}
      >
        <span
          style={{
            display: "block",
            width: "38%",
            height: "12px",
            background: "#b7b7b7"
          }}
        />
        <span
          style={{
            display: "block",
            width: "100%",
            height: "12px",
            background: "#d2d2d2"
          }}
        />
        <span
          style={{
            display: "block",
            width: "84%",
            height: "12px",
            background: "#d8d8d8"
          }}
        />
      </div>
    </div>
  );
}

export default LoadingState;
