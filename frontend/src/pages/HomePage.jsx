import { hasSupabaseConfig } from "../lib/supabase";

const previewSections = [
  "Paste conversation",
  "Add course context",
  "Review submission"
];

function HomePage() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Starter Screen</span>
        <h1>Check your AI conversation before you submit.</h1>
        <p>
          Minimal frontend scaffold aligned to the wireframe. This screen keeps
          the structure simple while the submission flow is added later.
        </p>
      </div>

      <div className="hero-divider" aria-hidden="true" />

      <div className="status-row">
        <span className="status-pill">
          {hasSupabaseConfig ? "Supabase Ready" : "Supabase Not Configured"}
        </span>
        <span>Frontend scaffold is running.</span>
      </div>

      <div className="preview-grid">
        {previewSections.map((section) => (
          <article className="preview-card" key={section}>
            <h2>{section}</h2>
            <div className="preview-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomePage;
