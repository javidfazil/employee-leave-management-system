import { Navigate, useNavigate } from "react-router-dom";

import useAuth from "../context/useAuth.js";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

const RoleSelection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  return (
    <main className="role-selection-page">
      <section className="role-selection">
        <div className="role-selection__brand"><span className="brand-mark">P</span><span>Penataxial Technologies</span><span className="role-selection__secure">Secure workspace</span><ThemeToggle className="theme-toggle--role" /></div>
        <div className="role-selection__intro">
          <span className="eyebrow">WORKFORCE PORTAL</span>
          <h1>Select your workspace</h1>
          <p>Penataxial Technologies Workforce Portal gives you secure access to the tools relevant to your role.</p>
        </div>
        <div className="role-cards">
          <button className="role-card" type="button" onClick={() => navigate("/login/employee")}>
            <span className="role-card__icon" aria-hidden="true">◷</span>
            <span><small className="role-card__label">PERSONAL WORKSPACE</small><strong>Employee Workspace</strong><small>Manage your leave requests, balance, and workplace updates.</small></span>
            <b aria-hidden="true">→</b>
          </button>
          <button className="role-card role-card--manager" type="button" onClick={() => navigate("/register/manager")}>
            <span className="role-card__icon" aria-hidden="true">◇</span>
            <span><small className="role-card__label">TEAM WORKSPACE</small><strong>Manager Control Center</strong><small>Review employee requests and manage approvals efficiently.</small></span>
            <b aria-hidden="true">→</b>
          </button>
        </div>
        <p className="role-selection__support">Need help accessing your account? Contact your HR administrator.</p>
      </section>
    </main>
  );
};

export default RoleSelection;
