import React from "react";
import { Modal, Button } from "react-bootstrap";

interface DeleteUserProps {
  show: boolean;
  onClose: () => void;
  onDelete: () => void;
  userName: string;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ show, onClose, onDelete, userName }) => {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the user :</p>
        <p className="fw-bold">{userName}</p>
        <p className="text-danger">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Confirm Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUser;
