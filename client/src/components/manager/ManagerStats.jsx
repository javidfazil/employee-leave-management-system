const ManagerStats = ({ summary }) => (
  <div className="stats-grid manager-stats">
    <article className="stat-card stat-card--featured">
      <span>Pending requests</span>
      <strong>{summary?.pending ?? "—"}</strong>
      <p>Awaiting your decision</p>
    </article>
    <article className="stat-card">
      <span>Approved leaves</span>
      <strong>{summary?.approved ?? "—"}</strong>
      <p>Total approved requests</p>
    </article>
    <article className="stat-card">
      <span>Rejected requests</span>
      <strong>{summary?.rejected ?? "—"}</strong>
      <p>Total rejected requests</p>
    </article>
    <article className="stat-card">
      <span>Employees on leave today</span>
      <strong>{summary?.onLeaveToday ?? "—"}</strong>
      <p>Currently on approved leave</p>
    </article>
  </div>
);

export default ManagerStats;
