function PolicyMatchList({ items = [] }) {
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
        Policy Match
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "16px"
        }}
      >
        {items.map((item, index) => (
          <div
            key={`${item.courseCode}-${item.sectionTitle}-${index}`}
            style={{
              padding: "14px",
              border: "1px solid #d7d7d7",
              background: "#fafafa"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "10px"
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#111111",
                  fontSize: "0.88rem",
                  fontWeight: 600
                }}
              >
                {item.courseCode}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "#5d5d5d",
                  fontSize: "0.82rem",
                  fontWeight: 600
                }}
              >
                {item.sectionTitle}
              </p>
            </div>

            <p
              style={{
                margin: 0,
                color: "#444444",
                fontSize: "0.86rem",
                lineHeight: 1.55
              }}
            >
              {item.snippet}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PolicyMatchList;
