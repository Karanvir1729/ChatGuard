import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import PageShell from "../components/PageShell";
import SecondaryButton from "../components/SecondaryButton";
import StatusBadge from "../components/StatusBadge";
import mockHistory from "../data/mockHistory";

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function getDecisionLabel(verdict) {
  return String(verdict || "")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function HistoryPage() {
  const navigate = useNavigate();

  const handleRowAction = (item) => {
    if (item.status === "draft") {
      navigate("/check/review");
      return;
    }

    navigate(`/check/result/${item.id}`);
  };

  return (
    <PageShell>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <section style={{ maxWidth: "760px" }}>
          <h1
            style={{
              margin: 0,
              color: "#111111",
              fontSize: "2rem",
              lineHeight: 1.08
            }}
          >
            History
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              color: "#5d5d5d",
              fontSize: "0.92rem",
              lineHeight: 1.5
            }}
          >
            Review past checks and reopen saved work when you need to continue
            or compare results.
          </p>
        </section>

        {mockHistory.length === 0 ? (
          <EmptyState
            desc="Saved drafts and completed checks will appear here once you start using the review flow."
            title="No history yet"
          />
        ) : (
          <section
            style={{
              border: "1px solid #cfcfcf",
              background: "#ffffff"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2fr) 140px 120px 120px 180px 120px",
                gap: "12px",
                padding: "14px 18px",
                borderBottom: "1px solid #dddddd",
                background: "#f7f7f7"
              }}
            >
              {["Title / ID", "Date", "Course Code", "Status", "Decision", "Action"].map(
                (label) => (
                  <p
                    key={label}
                    style={{
                      margin: 0,
                      color: "#666666",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase"
                    }}
                  >
                    {label}
                  </p>
                )
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {mockHistory.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 2fr) 140px 120px 120px 180px 120px",
                    gap: "12px",
                    alignItems: "center",
                    padding: "16px 18px",
                    borderTop: index === 0 ? "0" : "1px solid #e1e1e1"
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        color: "#111111",
                        fontSize: "0.92rem",
                        fontWeight: 600,
                        lineHeight: 1.4
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#6a6a6a",
                        fontSize: "0.8rem",
                        lineHeight: 1.4
                      }}
                    >
                      {item.id}
                    </p>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "#444444",
                      fontSize: "0.86rem"
                    }}
                  >
                    {formatDate(item.updatedAt)}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      color: "#222222",
                      fontSize: "0.86rem",
                      fontWeight: 600
                    }}
                  >
                    {item.courseCode}
                  </p>

                  <StatusBadge variant={item.status === "draft" ? "draft" : "likelyAllowed"}>
                    {item.status === "draft" ? "Draft" : "Completed"}
                  </StatusBadge>

                  <p
                    style={{
                      margin: 0,
                      color: "#333333",
                      fontSize: "0.86rem",
                      lineHeight: 1.45
                    }}
                  >
                    {getDecisionLabel(item.verdict)}
                  </p>

                  <SecondaryButton onClick={() => handleRowAction(item)}>
                    {item.status === "draft" ? "Resume" : "View"}
                  </SecondaryButton>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}

export default HistoryPage;
