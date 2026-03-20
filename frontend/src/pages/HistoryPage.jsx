import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import PageShell from "../components/PageShell";
import SecondaryButton from "../components/SecondaryButton";
import StatusBadge from "../components/StatusBadge";
import { getHistory } from "../lib/api";

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    getHistory()
      .then((historyItems) => {
        if (isActive) {
          setItems(historyItems);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

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

        {isLoading ? (
          <LoadingState label="Loading history" />
        ) : items.length === 0 ? (
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
              {items.map((item, index) => (
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

                  <StatusBadge variant={item.status === "draft" ? "draft" : item.decision}>
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
                    {item.decision}
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
