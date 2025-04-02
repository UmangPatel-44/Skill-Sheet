import { useState, useEffect } from "react";
import { changeUserPassword } from "../services/changePasswordService";

export const useChangePassword = (userEmail: string, onClose: () => void) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (oldPassword || newPassword || confirmPassword) {
      checkFormValidity();
    }
  }, [oldPassword, newPassword, confirmPassword]);

  const validateNewPassword = (password: string): string => {
    const passwordPattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$"
    );

    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (password.length > 64) return "Password cannot be more than 64 characters long.";
    if (!passwordPattern.test(password)) {
      return "Password must include uppercase, lowercase, digit, and special character.";
    }
    return "";
  };

  const checkFormValidity = () => {
    const newErrors = {
      oldPassword: oldPassword ? "" : "Old password is required.",
      newPassword: validateNewPassword(newPassword),
      confirmPassword:
        confirmPassword && newPassword === confirmPassword
          ? ""
          : "Passwords do not match.",
    };

    setErrors(newErrors);
    setIsFormValid(!Object.values(newErrors).some((msg) => msg !== ""));
  };

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      setError(null);
      await changeUserPassword(userEmail, oldPassword, newPassword);
      alert("Password changed successfully!");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while changing the password.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
