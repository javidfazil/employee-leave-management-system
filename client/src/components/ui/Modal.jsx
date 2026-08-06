const Modal = ({ children, title, onClose }) => (
  <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <header className="modal__header">
        <h2>{title}</h2>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close">×</button>
      </header>
      {children}
    </section>
  </div>
);

export default Modal;
