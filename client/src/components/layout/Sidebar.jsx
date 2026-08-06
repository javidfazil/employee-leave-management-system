import { NavLink } from "react-router-dom";

import useAuth from "../../context/useAuth.js";

const Sidebar = ({ isCollapsed, isOpen, onClose }) => {
  const { user } = useAuth();
  const dashboardPath =
    user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard";

  return (
    <aside className={`sidebar ${isCollapsed ? "sidebar--collapsed" : ""} ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar__brand">
        <span className="brand-mark">L</span>
        <span className="sidebar__brand-name">LeaveFlow</span>
        <button className="sidebar__close" type="button" onClick={onClose}>
          ×
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        <NavLink to={dashboardPath} className="sidebar__link" onClick={onClose}>
          <span>▦</span><b>Dashboard</b>
        </NavLink>
        <span className="sidebar__section">WORKSPACE</span>
        <NavLink to="/leaves" className="sidebar__link" onClick={onClose}><span>▤</span><b>Leave requests</b></NavLink>
        <NavLink to="/notifications" className="sidebar__link" onClick={onClose}><span>♢</span><b>Notifications</b></NavLink>
        <span className="sidebar__section">ACCOUNT</span>
        <NavLink to="/profile" className="sidebar__link" onClick={onClose}><span>○</span><b>Profile</b></NavLink>
      </nav>

      <div className="sidebar__help">
        <strong>Need help?</strong>
        <span>Reach out to your HR team.</span>
      </div>
    </aside>
  );
};

export default Sidebar;
