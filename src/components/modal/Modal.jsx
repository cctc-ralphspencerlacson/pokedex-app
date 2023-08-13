// CSS
import './Modal.css';

/**
 * Modal component for displaying content in a modal overlay.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @param {ReactNode} props.children - Content to be displayed inside the modal.
 * @returns {JSX.Element|null} The modal component or null if not open.
 */
const Modal = ({ isOpen, onClose, children }) => {
  /**
   * Handles the close action of the modal.
   */
  const handleClose = () => {
    onClose();
  };
  
  // Return null if the modal is not open
  if (!isOpen) {
    return null;
  }
  
  // Render the modal with content  
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
