const ManagerStats = ({ summary, onCardClick }) => (
  <div className="stats-grid manager-stats">
    <article className="stat-card stat-card--featured stat-card--interactive" role="button" tabIndex="0" onClick={() => onCardClick("Pending")} onKeyDown={(event) => event.key === "Enter" && onCardClick("Pending")}>
      <span>Pending requests</span>
      <strong>{summary?.pending ?? "—"}</strong>
      <p>Awaiting your decision</p>
    </article>
    <article className="stat-card stat-card--interactive" role="button" tabIndex="0" onClick={() => onCardClick("Approved")} onKeyDown={(event) => event.key === "Enter" && onCardClick("Approved")}>
      <span>Approved leaves</span>
      <strong>{summary?.approved ?? "—"}</strong>
      <p>Total approved requests</p>
    </article>
    <article className="stat-card stat-card--interactive" role="button" tabIndex="0" onClick={() => onCardClick("Rejected")} onKeyDown={(event) => event.key === "Enter" && onCardClick("Rejected")}>
      <span>Rejected requests</span>
      <strong>{summary?.rejected ?? "—"}</strong>
      <p>Total rejected requests</p>
    </article>
    <article className="stat-card stat-card--interactive" role="button" tabIndex="0" onClick={() => onCardClick("onLeaveToday")} onKeyDown={(event) => event.key === "Enter" && onCardClick("onLeaveToday")}>
      <span>Employees on leave today</span>
      <strong>{summary?.onLeaveToday ?? "—"}</strong>
      <p>Currently on approved leave</p>
    </article>
  </div>
);

export default ManagerStats;
