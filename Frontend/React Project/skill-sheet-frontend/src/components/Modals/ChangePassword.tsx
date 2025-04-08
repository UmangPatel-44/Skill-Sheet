import { Modal, Form, Button } from "react-bootstrap";
import { useChangePassword } from "../../hooks/useChangePassword";

interface ChangePasswordProps {
  show: boolean;
  onClose: () => void;
  userEmail: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ show, onClose, userEmail }) => {
  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    isFormValid,
    loading,
    error,
    handlePasswordChange,
  } = useChangePassword(userEmail, onClose);

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="oldPassword">Old Password</Form.Label>
            <Form.Control
              type="password"
              value={oldPassword}
              id="oldPassword"
              onChange={(e) => setOldPassword(e.target.value)}
              isInvalid={!!errors.oldPassword}
            />
            <Form.Control.Feedback type="invalid">{errors.oldPassword}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="newPassword">New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              id="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              isInvalid={!!errors.newPassword}
            />
            <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="confirmPassword">Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handlePasswordChange}
          disabled={!isFormValid || loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePassword;
