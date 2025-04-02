import { useState, useEffect } from "react";
import { updateUser } from "../services/userService";

interface UseEditUserProps {
  user: { userId: number; name: string; email: string; password: string };
  onUserUpdated: () => void;
  onClose: () => void;
}

const useEditUser = ({ user, onUserUpdated, onClose }: UseEditUserProps) => {
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [error, setError] = useState<string | null>(null);
  const validateFields=()=>
  {
    if (!updatedUser.name.trim()) {
      setError("Name is required.");
      return false;
    }
    if (!updatedUser.email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!updatedUser.password.trim()) {
      setError("Password is required.");
      return false;
    }
    setError(null);
    return true;
  }
  useEffect(() => {
    if (user) {
      setUpdatedUser({ ...user });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!validateFields()) return;
    try {
      const token = localStorage.getItem("token");
      await updateUser(user.email, updatedUser, token);
      onUserUpdated();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred while updating user details.");
    }
  };

  return { updatedUser, error, handleChange, handleUpdate };
};

export default useEditUser;
