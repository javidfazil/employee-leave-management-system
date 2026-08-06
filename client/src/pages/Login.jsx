import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

import useAuth from "../context/useAuth.js";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

const Login = () => {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useParams();
  const selectedRole = role === "manager" ? "manager" : "employee";
  const isManager = selectedRole === "manager";

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const authenticatedUser = await login({ ...form, selectedRole });
      const fallbackPath =
        authenticatedUser.role === "manager"
          ? "/manager/dashboard"
          : "/employee/dashboard";
      navigate(location.state?.from?.pathname || fallbackPath, { replace: true });
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
          <span className="eyebrow">WORKFORCE PORTAL</span>
          <h1>Secure workforce management, built for your day.</h1>
          <p>Manage leave, approvals, and workplace updates from one trusted workspace.</p>
        </div>
        <div className="auth-orb auth-orb--one" />
        <div className="auth-orb auth-orb--two" />
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <Link className="auth-form__back" to="/login">← Select your workspace</Link>
          <div className="auth-form__header">
            <span className="auth-form__role-icon" aria-hidden="true">{isManager ? "◇" : "◷"}</span>
            <div><span className="eyebrow">{isManager ? "MANAGER CONTROL CENTER" : "EMPLOYEE WORKSPACE"}</span><h2>Welcome Back</h2></div>
          </div>
          <p className="auth-form__intro">Access your workforce workspace securely.</p>
          {error && <p className="form-error">{error}</p>}
          <label>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
          <button className="button button--primary" disabled={isSubmitting} type="submit">{isSubmitting ? "Signing in..." : "Sign in"}</button>
          {!isManager && <p className="auth-form__footer">New here? <Link to="/register">Create an employee account</Link></p>}
        </form>
      </section>
    </div>
  );
};

export default Login;
