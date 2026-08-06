const ManagerStats = ({ summary }) => <div className="stats-grid manager-stats"><article className="stat-card stat-card--featured"><span>Pending requests</span><strong>{summary?.pending ?? "—"}</strong><p>Awaiting your decision</p></article><article className="stat-card"><span>Approved requests</span><strong>{summary?.approved ?? "—"}</strong><p>All time</p></article><article className="stat-card"><span>Rejected requests</span><strong>{summary?.rejected ?? "—"}</strong><p>All time</p></article></div>;

export default ManagerStats;
