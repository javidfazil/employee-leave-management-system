import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const authenticatedUser = await login(form);
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
        <div className="auth-brand"><span className="brand-mark">L</span> LeaveFlow</div>
        <div className="auth-copy">
          <span className="eyebrow">TIME OFF, SIMPLIFIED</span>
          <h1>Leave management that feels effortless.</h1>
          <p>Plan time away, keep your team aligned, and stay in control.</p>
        </div>
        <div className="auth-orb auth-orb--one" />
        <div className="auth-orb auth-orb--two" />
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="auth-form__intro">Enter your details to continue.</p>
          {error && <p className="form-error">{error}</p>}
          <label>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
          <button className="button button--primary" disabled={isSubmitting} type="submit">{isSubmitting ? "Signing in..." : "Sign in"}</button>
          <p className="auth-form__footer">New here? <Link to="/register">Create an account</Link></p>
        </form>
      </section>
    </div>
  );
};

export default Login;
