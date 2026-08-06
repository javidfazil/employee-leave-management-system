import { NavLink } from "react-router-dom";

const ManagerSidebar = () => (
  <aside className="sidebar manager-sidebar">
    <div className="sidebar__brand"><span className="brand-mark">P</span><span className="sidebar__brand-name">Penataxial <small>Manager Portal</small></span></div>
    <nav className="sidebar__nav" aria-label="Manager navigation">
      <NavLink to="/manager/dashboard" end className="sidebar__link"><span>▦</span><b>Dashboard</b></NavLink>
      <NavLink to="/manager/pending-requests" className="sidebar__link"><span>▤</span><b>Pending Requests</b></NavLink>
      <NavLink to="/manager/approved-requests" className="sidebar__link"><span>✓</span><b>Approved Requests</b></NavLink>
      <NavLink to="/manager/rejected-requests" className="sidebar__link"><span>×</span><b>Rejected Requests</b></NavLink>
      <NavLink to="/manager/notifications" className="sidebar__link"><span>♢</span><b>Notifications</b></NavLink>
      <NavLink to="/manager/profile" className="sidebar__link"><span>○</span><b>Profile</b></NavLink>
    </nav>
    <div className="sidebar__help"><strong>Manager support</strong><span>Contact the People Operations team.</span></div>
  </aside>
);

export default ManagerSidebar;
