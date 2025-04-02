import axios from "axios";

const API_BASE_URL = "https://localhost:7052/api/User";

export const getUsers = async (token: string) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch  {
    throw new Error("Failed to fetch users");
  }
};

export const deleteUser = async (email: string, token: string) => {
  try {
        await axios.delete(`${API_BASE_URL}/${encodeURIComponent(email)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  } catch {
    throw new Error("Failed to delete user");
  }
};
export const addUser = async (userData: any, token: string | null) => {
  try {
    const response = await fetch("https://localhost:7052/api/User", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    return await response.json(); // Return the created user data
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
  }
};



