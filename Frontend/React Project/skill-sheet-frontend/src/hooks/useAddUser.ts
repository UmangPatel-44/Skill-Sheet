import { useState } from "react";
import { addUser } from "../services/adminService";

export const useAddUser = (onUserAdded: () => void, onClose: () => void) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Password validation function
  const validatePassword = (password: string): string | null => {
    if (password.length < 8 || password.length > 64) {
      return "Password must be between 8 and 64 characters.";
    }
    if (!/[!@#$&*+]/.test(password)) {
      return "Password must contain at least one special character (!,@,#,$,&,*,+).";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one digit.";
    }
    return null;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === "password") {
      setPasswordError(validatePassword(value));
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (passwordError) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get JWT token
      await addUser(formData, token);
      alert("User added successfully!");
      setFormData({ name: "", email: "", password: "", role: "" });
      onUserAdded(); // Refresh user list
      onClose(); // Close modal
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, error, passwordError, handleChange, handleSubmit };
};
