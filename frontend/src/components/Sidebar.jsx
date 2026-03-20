// AI GENERATED FILE

import { NavLink } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/" },
  { label: "History", to: "/history" }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div className="brand-name">ChatGuard</div>
          <div className="brand-copy">AI Safety for Students</div>
        </div>

        <button className="btn btn-primary" type="button">
          New Check
        </button>
      </div>

      <nav className="nav-list" aria-label="Primary">
        {links.map((link) => (
          <NavLink
            key={link.label}
            className={({ isActive }) =>
              isActive ? "nav-link is-active" : "nav-link"
            }
            end={link.to === "/"}
            to={link.to}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid #d4d4d4",
          paddingTop: "14px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "30px",
              height: "30px",
              border: "1px solid #bdbdbd",
              borderRadius: "50%",
              background: "#e6e6e6",
              flexShrink: 0
            }}
          />
          <div>
            <div
              style={{
                color: "#111111",
                fontSize: "0.88rem",
                fontWeight: 600
              }}
            >
              Student
            </div>
            <div
              style={{
                color: "#6a6a6a",
                fontSize: "0.74rem"
              }}
            >
              Prototype User
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
