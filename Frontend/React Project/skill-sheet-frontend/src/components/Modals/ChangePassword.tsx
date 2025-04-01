import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

interface ChangePasswordProps {
  show: boolean;
  onClose: () => void;
  userEmail: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ show, onClose, userEmail }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    checkFormValidity();
  }, [oldPassword, newPassword, confirmPassword]);

  const validateNewPassword = (password: string): string => {
    const passwordPattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$"
    );

    if (!password) {
      return "Password is required.";
    } else if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    } else if (password.length > 64) {
      return "Password cannot be more than 10 characters long.";
    } else if (!passwordPattern.test(password)) {
      return "Password must include uppercase, lowercase, digit, special character.";
    }
    return "";
  };

  const checkFormValidity = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
    let valid = true;

    if (!oldPassword) {
      newErrors.oldPassword = "Old password is required.";
      valid = false;
    }

    const newPassError = validateNewPassword(newPassword);
    if (newPassError) {
      newErrors.newPassword = newPassError;
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
      valid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    setIsFormValid(valid);
  };

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await fetch(`https://localhost:7052/api/User/changePassword/${userEmail}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userEmail,
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to change password. Please check your old password.");
      }

      alert("Password changed successfully!");
      onClose();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred while changing the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              isInvalid={!!errors.oldPassword}
            />
            <Form.Control.Feedback type="invalid">{errors.oldPassword}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              isInvalid={!!errors.newPassword}
            />
            <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
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
