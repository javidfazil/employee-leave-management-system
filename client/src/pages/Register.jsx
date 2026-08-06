import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import useAuth from "../context/useAuth.js";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

const Register = () => {
  const { register, user } = useAuth();
  const { role } = useParams();
  const isManager = role === "manager";
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", department: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department,
        role: isManager ? "manager" : "employee",
      }, { persist: !isManager });
      if (isManager) {
        navigate("/login/manager", { replace: true, state: { message: "Manager account created. Sign in to access your control center." } });
      } else {
        navigate("/employee/dashboard", { replace: true });
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create your account.");
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
          <h1>{isManager ? "Set up your manager workspace." : "A secure workspace for your workforce journey."}</h1>
          <p>{isManager ? "Create your manager account to review requests and support your team." : "Create your employee account to manage leave, balances, and workplace updates."}</p>
        </div>
        <p className="auth-panel__footer">A workplace solution by Penataxial Technologies</p>
        <div className="auth-orb auth-orb--one" />
        <div className="auth-orb auth-orb--two" />
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <span className="eyebrow">{isManager ? "MANAGER ONBOARDING" : "GET STARTED"}</span>
          <h2>{isManager ? "Create manager account" : "Create your account"}</h2>
          <p className="auth-form__intro">{isManager ? "Use your official details to set up your manager workspace." : "It only takes a minute."}</p>
          {error && <p className="form-error">{error}</p>}
          <label>Full name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} minLength="2" required /></label>
          <label>{isManager ? "Official email" : "Email address"}<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          {isManager && <label>Department<input value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} minLength="2" required /></label>}
          <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength="8" required /></label>
          <label>Confirm password<input type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} minLength="8" required /></label>
          <button className="button button--primary" disabled={isSubmitting} type="submit">{isSubmitting ? "Creating account..." : isManager ? "Create Manager Account →" : "Create Account →"}</button>
          <p className="auth-form__footer">Already have an account? <Link to={isManager ? "/login/manager" : "/login/employee"}>Sign in</Link></p>
        </form>
      </section>
    </div>
  );
};

export default Register;
