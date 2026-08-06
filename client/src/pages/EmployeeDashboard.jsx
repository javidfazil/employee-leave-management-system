import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api.js";
import useAuth from "../context/useAuth.js";

const formatDate = (date) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard/employee")
      .then(({ data }) => setDashboard(data))
      .catch(() => setError("We could not load your dashboard. Please refresh."));
  }, []);

  const balance = dashboard?.leaveBalance;
  const counts = dashboard?.leaveCounts;

  return (
    <section className="dashboard-page">
      <div className="page-heading dashboard-hero"><div><span className="eyebrow">EMPLOYEE WORKSPACE</span><h1>Welcome back, {user.name?.split(" ")[0]}.</h1><p>Review your leave balance, request status, and recent workplace activity.</p></div><Link className="button button--primary" to="/leaves">Submit Leave Request <span aria-hidden="true">→</span></Link></div>
      {error && <p className="form-error">{error}</p>}
      <div className="stats-grid">
        <article className="stat-card stat-card--featured"><span>Available balance</span><strong>{balance?.total ?? "—"}<small> days</small></strong><p>Across all leave types</p></article>
        <article className="stat-card"><span>Requests awaiting review</span><strong>{counts?.pending ?? "—"}</strong><p>Currently with your manager</p></article>
        <article className="stat-card"><span>Approved leaves</span><strong>{counts?.approved ?? "—"}</strong><p>All time</p></article>
        <article className="stat-card"><span>Rejected requests</span><strong>{counts?.rejected ?? "—"}</strong><p>All time</p></article>
      </div>
      <div className="dashboard-grid">
        <article className="panel"><div className="panel__heading"><div><h2>Leave balance</h2><p>Your remaining days by type.</p></div></div><div className="balance-list">{[["Casual", balance?.casual], ["Sick", balance?.sick], ["Earned", balance?.earned]].map(([label, value]) => <div className="balance-row" key={label}><span>{label} leave</span><strong>{value ?? "—"} days</strong></div>)}</div></article>
        <article className="panel" id="leave-requests"><div className="panel__heading"><div><h2>Recent activity</h2><p>Your latest leave activity and request outcomes.</p></div><Link to="/leaves">View history</Link></div><div className="request-list">{dashboard?.recentLeaves?.length ? dashboard.recentLeaves.map((leave) => <div className="request-item" key={leave._id}><div><strong>{leave.leaveType} leave</strong><span>{formatDate(leave.startDate)} – {formatDate(leave.endDate)}</span></div><span className={`status status--${leave.status.toLowerCase()}`}>{leave.status}</span></div>) : <p className="empty-state">No leave history is available yet.</p>}</div></article>
      </div>
    </section>
  );
};

export default EmployeeDashboard;
