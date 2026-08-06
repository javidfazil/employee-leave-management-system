import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api.js";
import useAuth from "../context/useAuth.js";

const formatDate = (date) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard/manager")
      .then(({ data }) => setDashboard(data))
      .catch(() => setError("We could not load the management dashboard. Please refresh."));
  }, []);

  const totals = dashboard?.totals;
  const employeesOnLeaveToday = dashboard?.employeesOnLeaveToday || [];

  return (
    <section className="dashboard-page">
      <div className="page-heading dashboard-hero"><div><span className="eyebrow">MANAGER OPERATIONS CENTER</span><h1>Team overview, {user.name?.split(" ")[0]}.</h1><p>Stay ahead of leave activity, pending approvals, and team availability.</p></div><Link className="button button--primary" to="/leaves">Review Requests <span aria-hidden="true">→</span></Link></div>
      {error && <p className="form-error">{error}</p>}
      <div className="stats-grid"><article className="stat-card stat-card--featured"><span>Total employees</span><strong>{totals?.employees ?? "—"}</strong><p>Active team members</p></article><article className="stat-card"><span>Requests awaiting review</span><strong>{totals?.pendingRequests ?? "—"}</strong><p>Require manager action</p></article><article className="stat-card"><span>Approved requests</span><strong>{totals?.approvedRequests ?? "—"}</strong><p>All time</p></article><article className="stat-card"><span>Declined requests</span><strong>{totals?.rejectedRequests ?? "—"}</strong><p>All time</p></article><article className="stat-card"><span>On leave today</span><strong>{employeesOnLeaveToday.length}</strong><p>Approved leave today</p></article></div>
      <article className="panel panel--wide"><div className="panel__heading"><div><h2>Employees on leave today</h2><p>Team members with approved leave covering today.</p></div></div><div className="request-list">{employeesOnLeaveToday.length ? employeesOnLeaveToday.map((leave) => <div className="request-item" key={leave._id}><div><strong>{leave.employee?.name || "Former employee"}</strong><span>{leave.leaveType} leave · {formatDate(leave.startDate)} – {formatDate(leave.endDate)}</span></div><span className="status status--approved">On leave</span></div>) : <p className="empty-state">No employees are on approved leave today.</p>}</div></article>
      <article className="panel panel--wide" id="leave-requests"><div className="panel__heading"><div><h2>Recent leave requests</h2><p>The latest requests across your team.</p></div><Link to="/leaves">View all</Link></div><div className="request-list">{dashboard?.recentLeaves?.length ? dashboard.recentLeaves.map((leave) => <div className="request-item" key={leave._id}><div><strong>{leave.employee?.name || "Former employee"} <span className="request-item__type">· {leave.leaveType} leave</span></strong><span>{formatDate(leave.startDate)} – {formatDate(leave.endDate)} · {leave.totalDays} day(s)</span></div><span className={`status status--${leave.status.toLowerCase()}`}>{leave.status}</span></div>) : <p className="empty-state">No leave requests yet.</p>}</div></article>
    </section>
  );
};

export default ManagerDashboard;
