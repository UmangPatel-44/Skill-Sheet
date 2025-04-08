import { Modal } from "react-bootstrap";
import AddUser from "./Modals/AddUser";
import EditUser from "./Modals/EditUser";
import ChangePassword from "./Modals/ChangePassword";
import DeleteUser from "./Modals/DeleteUser";

interface ModalProps {
  show: boolean;
  onClose: () => void;
}

interface AddUserModalProps extends ModalProps {
  onUserAdded: () => void;
}

interface EditUserModalProps extends ModalProps {
  user: { userId: number; name: string; email: string; password: string } | null;
  onUserUpdated: () => void;
}

interface ChangePasswordModalProps extends ModalProps {
  userEmail: string | null;
}

interface DeleteUserModalProps extends ModalProps {
  onDelete: () => void;
  userName: string | null;
}

export const AddUserModal = ({ show, onClose, onUserAdded }: AddUserModalProps) => (
  <Modal show={show} onHide={onClose} centered backdrop="static">
    <Modal.Header closeButton>
      <Modal.Title>Add New User</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <AddUser onUserAdded={onUserAdded} onClose={onClose} />
    </Modal.Body>
  </Modal>
);

export const EditUserModal = ({ show, onClose, user, onUserUpdated }: EditUserModalProps) =>
  user ? <EditUser show={show} onClose={onClose} user={user} onUserUpdated={onUserUpdated} /> : null;

export const ChangePasswordModal = ({ show, onClose, userEmail }: ChangePasswordModalProps) =>
  userEmail ? <ChangePassword show={show} onClose={onClose} userEmail={userEmail}/> : null;

export const DeleteUserModal = ({ show, onClose, onDelete, userName }: DeleteUserModalProps) =>
  userName ? <DeleteUser show={show} onClose={onClose} onDelete={onDelete} userName={userName} /> : null;
