const Card = ({ children, className = "" }) => (
  <section className={`card ${className}`}>{children}</section>
);

export default Card;
