// AI GENERATED FILE

import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import PageShell from "../components/PageShell";
import SecondaryButton from "../components/SecondaryButton";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <EmptyState
        action={
          <SecondaryButton onClick={() => navigate("/")}>
            Back to Dashboard
          </SecondaryButton>
        }
        desc="The page you tried to open is not available in this prototype."
        title="Page not found"
      />
    </PageShell>
  );
}

export default NotFoundPage;
