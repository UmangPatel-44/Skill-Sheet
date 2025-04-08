import { Modal, Form, Button } from "react-bootstrap";
import useEditUser from "../../hooks/useEditUser";

interface EditUserProps {
  show: boolean;
  onClose: () => void;
  user: { userId: number; name: string; email: string; password: string };
  onUserUpdated: () => void;
}

const EditUser: React.FC<EditUserProps> = ({ show, onClose, user, onUserUpdated }) => {
  const { updatedUser, error, handleChange, handleUpdate } = useEditUser({ user, onUserUpdated, onClose });
  
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form>
          <Form.Group>
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control id="name" type="text" name="name" value={updatedUser.name} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={updatedUser.email} onChange={handleChange} readOnly/>
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={updatedUser.password} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="success" onClick={handleUpdate}>Update</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUser;
