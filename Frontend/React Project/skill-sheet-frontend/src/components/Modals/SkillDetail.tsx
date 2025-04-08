import React from "react";
import { Modal, Button } from "react-bootstrap";

interface SkillDetailModalProps {
  show: boolean;
  handleClose: () => void;
  skill: { name: string; level: string; experience: number; category: string; userSkillId: number }|null;
  handleDelete: (skillId: number) => void;
}

const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  show,
  handleClose,
  skill,
  handleDelete,
}) => {
  if (!skill) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Skill Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Name:</strong> {skill.name}</p>
        <p><strong>Level:</strong> {skill.level}</p>
        <p><strong>Experience:</strong> {skill.experience} years</p>
        <p><strong>Category:</strong> {skill.category}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => handleDelete(skill.userSkillId)}>
          Delete
        </Button>
        <Button variant="outline-secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SkillDetailModal;
