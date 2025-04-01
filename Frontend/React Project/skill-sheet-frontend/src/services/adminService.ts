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


