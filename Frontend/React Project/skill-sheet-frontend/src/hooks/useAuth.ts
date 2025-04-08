import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsersByRole, loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"User" | "Admin">("User");
  const [users, setUsers] = useState<string[]>([]);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    role: "",
    email: "",
    password: ""
  });
  const validate = () => {
    let valid = true;
    const newErrors = { role: "", email: "", password: "" };
    // Role validation
    if (!role) {
      newErrors.role = "Please select a role.";
      valid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = "Please select an email.";
      valid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      valid = false;
    }
    else if (password.length>64)
    {
      newErrors.password="Password cannot be more than 64 characters long";
      valid=false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validate()) {
      handleLogin(e);
    }
  };


  useEffect(() => {
    if (user) {
      navigate(user.role === "Admin" ? "/admindashboard" : "/dashboard", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const getUsers = async () => {
      const userEmails = await fetchUsersByRole(role);
      setUsers(userEmails);
      setEmail(""); // Reset email when role changes
    };
    getUsers();
  }, [role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password, role);
      login({ email, role, token: data.token });
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);
      navigate(role === "Admin" ? "/admindashboard" : "/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      if ((error as { response?: { status: number } }).response?.status === 401) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Incorrect password, please try again.",
        }));
      } else {
        // Generic error
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Login failed. Please check your credentials.",
        }));
      }
  
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    users,
    handleSubmit,
    errors,
    setErrors,
  };
};
