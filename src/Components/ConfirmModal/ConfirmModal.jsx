import { Modal, Button } from "react-bootstrap";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmModal = ({ show, onHide, onConfirm, title, message, confirmText = "Ya", cancelText = "Batal", variant = "danger" }) => {
    return (
        <Modal show={show} onHide={onHide} centered size="sm">
            <Modal.Body className="text-center p-4">
                <div className={`text-${variant} mb-3`}>
                    <FiAlertTriangle size={48} />
                </div>
                <h5 className="mb-2 fw-bold">{title}</h5>
                <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>{message}</p>
                <div className="d-flex justify-content-center gap-2">
                    <Button variant="light" onClick={onHide} className="px-4 border">
                        {cancelText}
                    </Button>
                    <Button variant={variant} onClick={() => { onConfirm(); onHide(); }} className="px-4">
                        {confirmText}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ConfirmModal;
