import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register, user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(form);
      navigate("/employee/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand"><span className="brand-mark">L</span> LeaveFlow</div>
        <div className="auth-copy">
          <span className="eyebrow">YOUR TIME, WELL MANAGED</span>
          <h1>A clearer way to plan time away.</h1>
          <p>Create your account and keep your leave requests organized.</p>
        </div>
        <div className="auth-orb auth-orb--one" />
        <div className="auth-orb auth-orb--two" />
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <span className="eyebrow">GET STARTED</span>
          <h2>Create your account</h2>
          <p className="auth-form__intro">It only takes a minute.</p>
          {error && <p className="form-error">{error}</p>}
          <label>Full name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} minLength="2" required /></label>
          <label>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength="8" required /></label>
          <button className="button button--primary" disabled={isSubmitting} type="submit">{isSubmitting ? "Creating account..." : "Create account"}</button>
          <p className="auth-form__footer">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </section>
    </div>
  );
};

export default Register;
