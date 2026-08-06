import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../context/useAuth.js";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

const ManagerLogin = () => {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ ...form, selectedRole: "manager" });
      navigate(location.state?.from?.pathname || "/manager/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to sign in. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand"><span className="brand-mark">P</span><span>Penataxial Technologies</span></div>
        <ThemeToggle className="theme-toggle--auth" />
        <div className="auth-copy">
          <span className="eyebrow">INTERNAL WORKFORCE PLATFORM</span>
          <h1>Empowering people through smarter workplace experiences.</h1>
          <p>A secure digital workspace designed to simplify employee collaboration, leave management, and workforce operations.</p>
        </div>
        <p className="auth-panel__footer">A workplace solution by Penataxial Technologies</p>
        <div className="auth-orb auth-orb--one" />
        <div className="auth-orb auth-orb--two" />
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <Link className="auth-form__back" to="/login">← Select your workspace</Link>
          <div className="auth-form__header">
            <span className="auth-form__role-icon" aria-hidden="true">◇</span>
            <div><span className="eyebrow">MANAGER CONTROL CENTER</span><h2>Manager Control Center</h2></div>
          </div>
          {location.state?.message && <p className="form-success" role="status">{location.state.message}</p>}
          <p className="auth-form__intro">Review employee requests, manage approvals, and support efficient workforce operations.</p>
          {error && <p className="form-error">{error}</p>}
          <label>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
          <button className="button button--primary" disabled={isSubmitting} type="submit">{isSubmitting ? "Signing in..." : "Login as Manager →"}</button>
          <p className="auth-form__footer">New manager? <Link to="/register/manager">Create a manager account</Link></p>
        </form>
      </section>
    </div>
  );
};

export default ManagerLogin;
