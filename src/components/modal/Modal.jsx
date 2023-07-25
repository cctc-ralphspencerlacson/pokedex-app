// CSS
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
        <div className="modal">
          <span className="close" onClick={handleClose}>
            &times;
          </span>
          {children}
        </div>
    </div>
  );
};

export default Modal;
