const EmptyState = ({ title, message }) => (
  <div className="empty-state">
    <span className="empty-state__icon">□</span>
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);

export default EmptyState;
