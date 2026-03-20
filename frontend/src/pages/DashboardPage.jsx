import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import SectionCard from "../components/SectionCard";

const dashboardCards = [
  {
    title: "Paste full AI conversation",
    description:
      "Add the complete exchange so the review has enough context for a fair analysis."
  },
  {
    title: "Add course context",
    description:
      "Provide the institution, course, and assignment details that define what is allowed."
  },
  {
    title: "Receive verdict and reasoning",
    description:
      "Get a plain-language result with supporting rationale before you decide to submit."
  }
];

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "18px"
          }}
        >
          <div style={{ maxWidth: "640px" }}>
            <h1
              style={{
                margin: 0,
                color: "#111111",
                fontSize: "2.3rem",
                lineHeight: 1.08
              }}
            >
              Check your AI conversation before you submit
            </h1>
            <p
              style={{
                margin: "14px 0 0",
                color: "#595959",
                fontSize: "0.94rem",
                lineHeight: 1.55
              }}
            >
              Review your AI-assisted work against course expectations before it
              becomes part of a final submission.
            </p>
          </div>

          <div
            aria-hidden="true"
            style={{
              width: "360px",
              height: "12px",
              background: "#8f8f8f"
            }}
          />

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <PrimaryButton onClick={() => navigate("/check/start")}>
              Start New Check
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate("/learn-more")}>
              Learn More
            </SecondaryButton>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "18px"
          }}
        >
          {dashboardCards.map((card) => (
            <SectionCard
              description={card.description}
              key={card.title}
              title={card.title}
            >
              <div style={{ display: "grid", gap: "8px" }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "12px",
                    background: "#a4a4a4"
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    display: "block",
                    width: "86%",
                    height: "12px",
                    background: "#b9b9b9"
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    display: "block",
                    width: "72%",
                    height: "12px",
                    background: "#cecece"
                  }}
                />
              </div>
            </SectionCard>
          ))}
        </section>
      </div>
    </PageShell>
  );
}

export default DashboardPage;
