// AI GENERATED FILE

import PageShell from "../components/PageShell";
import SectionCard from "../components/SectionCard";

function LearnMorePage() {
  return (
    <PageShell>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <section style={{ maxWidth: "760px" }}>
          <h1
            style={{
              margin: 0,
              color: "#111111",
              fontSize: "2rem",
              lineHeight: 1.08
            }}
          >
            Learn More
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              color: "#5d5d5d",
              fontSize: "0.92rem",
              lineHeight: 1.5
            }}
          >
            A short overview of what ChatGuard is designed to help with in this
            prototype.
          </p>
        </section>

        <SectionCard title="What ChatGuard is">
          <p
            style={{
              margin: 0,
              color: "#4d4d4d",
              fontSize: "0.9rem",
              lineHeight: 1.6
            }}
          >
            ChatGuard is a review tool for students who want a second look at
            how AI may have influenced coursework before submission.
          </p>
        </SectionCard>

        <SectionCard title="What it checks">
          <p
            style={{
              margin: 0,
              color: "#4d4d4d",
              fontSize: "0.9rem",
              lineHeight: 1.6
            }}
          >
            It looks at the conversation itself, the kind of help the model
            provided, and how that support may relate to the assignment.
          </p>
        </SectionCard>

        <SectionCard title="Why full context matters">
          <p
            style={{
              margin: 0,
              color: "#4d4d4d",
              fontSize: "0.9rem",
              lineHeight: 1.6
            }}
          >
            Partial excerpts can be misleading. The full exchange helps the
            review distinguish between brainstorming, editing support, and more
            direct content generation.
          </p>
        </SectionCard>

        <SectionCard title="Why course context matters">
          <p
            style={{
              margin: 0,
              color: "#4d4d4d",
              fontSize: "0.9rem",
              lineHeight: 1.6
            }}
          >
            Acceptable AI use can vary by course, assignment type, and student
            expectations. Adding course context makes the result more grounded
            and more useful.
          </p>
        </SectionCard>

        <SectionCard title="Privacy and consent">
          <p
            style={{
              margin: 0,
              color: "#4d4d4d",
              fontSize: "0.9rem",
              lineHeight: 1.6
            }}
          >
            Only upload material you have permission to review, and avoid
            sharing sensitive personal information unless you understand the
            privacy expectations for the tool you are using.
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}

export default LearnMorePage;
