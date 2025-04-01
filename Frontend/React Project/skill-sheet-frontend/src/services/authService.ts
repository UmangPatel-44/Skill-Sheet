import axios from "axios";

export const fetchUsersByRole = async (role: "User" | "Admin") => {
  try {
    const response = await axios.get(`https://localhost:7052/api/User/users?role=${role}`);
    if (response.status === 200) {
      return response.data.map((user: { email: string }) => user.email);
    }
  } catch (error) {
    console.error("Failed to fetch users", error);
    return [];
  }
};

export const loginUser = async (email: string, password: string, role: "User" | "Admin") => {
  try {
    const response = await axios.post("https://localhost:7052/api/Auth/login", {
      email,
      password,
      role,
    });

    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};
