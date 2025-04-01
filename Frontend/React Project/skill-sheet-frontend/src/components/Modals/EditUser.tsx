import { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";


interface EditUserProps {
  show: boolean;
  onClose: () => void;
  user: { userId: number; name: string; email: string; password: string };
  onUserUpdated: () => void;
}

const EditUser: React.FC<EditUserProps> = ({ show, onClose, user, onUserUpdated }) => {
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (user) {
      setUpdatedUser({ ...user }); // Update state when user prop changes
    }
  }, [user]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    console.log(updatedUser.password);
  };
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`  https://localhost:7052/api/User/email/${user.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedUser.name,
          email: updatedUser.email,
          password: updatedUser.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      onUserUpdated();
      onClose();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred while updating user details.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={updatedUser.name} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={updatedUser.email} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={updatedUser.password} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-success" onClick={handleUpdate}>Update</button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUser;
