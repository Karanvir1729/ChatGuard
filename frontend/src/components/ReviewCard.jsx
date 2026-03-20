function ReviewCard({ title, action, children }) {
  return (
    <section
      style={{
        border: "1px solid #c9c9c9",
        background: "#ffffff"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          padding: "18px 20px",
          borderBottom: "1px solid #dddddd"
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
          {title}
        </h2>

        {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
      </div>

      <div
        style={{
          padding: "20px"
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default ReviewCard;
