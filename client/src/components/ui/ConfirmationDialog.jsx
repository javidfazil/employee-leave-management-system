import Modal from "./Modal.jsx";

const ConfirmationDialog = ({ description, onCancel, onConfirm, title }) => (
  <Modal title={title} onClose={onCancel}>
    <div className="confirmation-dialog">
      <p>{description}</p>
      <div className="modal__actions">
        <button className="button button--secondary" type="button" onClick={onCancel}>Keep request</button>
        <button className="button button--primary" type="button" onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  </Modal>
);

export default ConfirmationDialog;
