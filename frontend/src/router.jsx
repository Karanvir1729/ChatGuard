import {
  Link,
  createBrowserRouter
} from "react-router-dom";
import EmptyState from "./components/EmptyState";
import PageShell from "./components/PageShell";
import SecondaryButton from "./components/SecondaryButton";
import StatusBadge from "./components/StatusBadge";
import TopProgress from "./components/TopProgress";

function ShellPage({ title, description, children }) {
  return (
    <PageShell>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <p
            style={{
              margin: 0,
              color: "#666666",
              fontSize: "0.76rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}
          >
            ChatGuard
          </p>
          <h1
            style={{
              margin: "10px 0 8px",
              color: "#111111",
              fontSize: "2rem",
              lineHeight: 1.1
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: "620px",
              color: "#5a5a5a",
              fontSize: "0.92rem",
              lineHeight: 1.5
            }}
          >
            {description}
          </p>
        </div>

        {children}
      </div>
    </PageShell>
  );
}

function PlaceholderPanel({ title, description, action, children }) {
  return (
    <section
      style={{
        border: "1px solid #cfcfcf",
        background: "#ffffff",
        padding: "22px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: children ? "16px" : 0
        }}
      >
        <div>
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
          <p
            style={{
              margin: "6px 0 0",
              color: "#666666",
              fontSize: "0.86rem",
              lineHeight: 1.45
            }}
          >
            {description}
          </p>
        </div>

        {action ? <div>{action}</div> : null}
      </div>

      {children}
    </section>
  );
}

function DashboardPage() {
  return (
    <ShellPage
      description="Start a new review or revisit previous analysis runs."
      title="Dashboard"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "18px"
        }}
      >
        {["Paste Conversation", "Add Course Context", "Review Submission"].map(
          (item) => (
            <PlaceholderPanel
              description="Placeholder block matching the early dashboard wireframe."
              key={item}
              title={item}
            >
              <div style={{ display: "grid", gap: "8px" }}>
                <span
                  style={{ height: "12px", width: "100%", background: "#b0b0b0" }}
                />
                <span
                  style={{ height: "12px", width: "86%", background: "#c2c2c2" }}
                />
                <span
                  style={{ height: "12px", width: "72%", background: "#d2d2d2" }}
                />
              </div>
            </PlaceholderPanel>
          )
        )}
      </div>
    </ShellPage>
  );
}

function LoginPage() {
  return (
    <ShellPage
      description="Basic placeholder login screen for the prototype router."
      title="Welcome to ChatGuard"
    >
      <PlaceholderPanel description="Authentication UI will be added here." title="Login">
        <div style={{ maxWidth: "360px", display: "grid", gap: "12px" }}>
          <div
            style={{ height: "40px", border: "1px solid #cfcfcf", background: "#fafafa" }}
          />
          <div
            style={{ height: "40px", border: "1px solid #cfcfcf", background: "#fafafa" }}
          />
          <div
            style={{ height: "40px", width: "140px", background: "#2b2b2b" }}
          />
        </div>
      </PlaceholderPanel>
    </ShellPage>
  );
}

function StartCheckPage() {
  return (
    <ShellPage
      description="Step 1 placeholder for pasting a conversation transcript."
      title="Start a New Check"
    >
      <TopProgress currentStep={1} />
      <PlaceholderPanel description="Conversation input area will live here." title="Paste Conversation">
        <div
          style={{
            minHeight: "280px",
            border: "1px solid #cfcfcf",
            background: "#f9f9f9"
          }}
        />
      </PlaceholderPanel>
    </ShellPage>
  );
}

function CourseContextPage() {
  return (
    <ShellPage
      description="Step 2 placeholder for class and assignment details."
      title="Add Course Context"
    >
      <TopProgress currentStep={2} />
      <PlaceholderPanel description="Course context form will be added here." title="Course Details">
        <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <div
            style={{ height: "40px", border: "1px solid #cfcfcf", background: "#fafafa" }}
          />
          <div
            style={{ height: "40px", border: "1px solid #cfcfcf", background: "#fafafa" }}
          />
          <div
            style={{ height: "40px", border: "1px solid #cfcfcf", background: "#fafafa" }}
          />
          <div
            style={{ height: "40px", border: "1px solid #cfcfcf", background: "#fafafa" }}
          />
        </div>
      </PlaceholderPanel>
    </ShellPage>
  );
}

function ReviewPage() {
  return (
    <ShellPage
      description="Step 3 placeholder for reviewing the compiled submission."
      title="Review Submission"
    >
      <TopProgress currentStep={3} />
      <PlaceholderPanel description="Review inputs and uploaded references will appear here." title="Submission Review">
        <div style={{ display: "grid", gap: "14px" }}>
          <div
            style={{ minHeight: "84px", border: "1px solid #cfcfcf", background: "#fafafa" }}
          />
          <div
            style={{ minHeight: "84px", border: "1px solid #cfcfcf", background: "#fafafa" }}
          />
        </div>
      </PlaceholderPanel>
    </ShellPage>
  );
}

function ResultPage() {
  return (
    <ShellPage
      description="Step 4 placeholder for the final analysis result."
      title="Final Analysis"
    >
      <TopProgress currentStep={4} />
      <PlaceholderPanel
        action={<StatusBadge variant="draft" />}
        description="Result summary, supporting notes, and recommendation details will appear here."
        title="Analysis Summary"
      >
        <div style={{ display: "grid", gap: "14px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <StatusBadge variant="likelyAllowed" />
            <StatusBadge variant="allowedWithAdvisory" />
            <StatusBadge variant="needsCaution" />
            <StatusBadge variant="highRisk" />
          </div>
          <div
            style={{ minHeight: "140px", border: "1px solid #cfcfcf", background: "#fafafa" }}
          />
        </div>
      </PlaceholderPanel>
    </ShellPage>
  );
}

function HistoryPage() {
  return (
    <ShellPage
      description="Placeholder history page for previous review runs."
      title="History"
    >
      <EmptyState
        action={
          <Link to="/check/start">
            <SecondaryButton>Start New Check</SecondaryButton>
          </Link>
        }
        desc="Previous checks will appear here once analysis history is available."
        title="No history yet"
      />
    </ShellPage>
  );
}

function LearnMorePage() {
  return (
    <ShellPage
      description="Placeholder learning page for policies, guidance, and methodology."
      title="Learn More"
    >
      <PlaceholderPanel description="Explanatory content will be added here." title="About ChatGuard">
        <p
          style={{
            margin: 0,
            maxWidth: "720px",
            color: "#5a5a5a",
            fontSize: "0.9rem",
            lineHeight: 1.6
          }}
        >
          This prototype helps students review AI-assisted work against course expectations before submission.
        </p>
      </PlaceholderPanel>
    </ShellPage>
  );
}

function NotFoundPage() {
  return (
    <ShellPage
      description="The requested page does not exist in the current prototype."
      title="Page Not Found"
    >
      <EmptyState
        action={
          <Link to="/">
            <SecondaryButton>Back to Dashboard</SecondaryButton>
          </Link>
        }
        desc="Use the main navigation to return to a valid route."
        title="Route not found"
      />
    </ShellPage>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <DashboardPage />
  },
  {
    path: "/check/start",
    element: <StartCheckPage />
  },
  {
    path: "/check/context",
    element: <CourseContextPage />
  },
  {
    path: "/check/review",
    element: <ReviewPage />
  },
  {
    path: "/check/result/:id",
    element: <ResultPage />
  },
  {
    path: "/history",
    element: <HistoryPage />
  },
  {
    path: "/learn-more",
    element: <LearnMorePage />
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

export default router;
