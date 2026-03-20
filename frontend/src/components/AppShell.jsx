import { NavLink } from "react-router-dom";
import { navItems } from "../data/navItems";

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div className="brand-name">ChatGuard</div>
          <div className="brand-copy">AI review workspace</div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              className={({ isActive }) =>
                isActive ? "nav-link is-active" : "nav-link"
              }
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <div className="top-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="content-card">{children}</div>
      </main>
    </div>
  );
}

export default AppShell;
