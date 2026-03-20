// AI GENERATED FILE

import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";

function PageShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-panel">
        <HeaderBar />

        <div className="content-card">{children}</div>
      </main>
    </div>
  );
}

export default PageShell;
