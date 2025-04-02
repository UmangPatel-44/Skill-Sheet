import axios from "axios";
import { UserApiResponse, UserDetailApiResponse } from "../data/types/UserTypes";

const API_BASE_URL = "https://localhost:7052/api";



//this function fetches the user details from the backend
export const fetchUserDetails = async (): Promise<UserDetailApiResponse> => { 
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/userdetails/me`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  return response.data;
};
// this function fetches the user from the backend
export const fetchUser = async (): Promise<UserApiResponse> => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/User/profile`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  return response.data;
};
//this function updates the user details in the backend
export const updateUserDetails = async (updatedUserDetail: UserDetailApiResponse) => {
  const token = localStorage.getItem("token");
  await axios.put(`${API_BASE_URL}/userdetails/me`, updatedUserDetail, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
};
//this function add the user in the backend
export const addUser = async (name: string, email: string, password: string, token: string | null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/User`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
  
      return true; // User added successfully
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };
  export const getProfilePhoto = async () => {
    try {
      // Retrieve the token from local storage or context
      const token = localStorage.getItem("token"); // Ensure token is stored on login
  
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      const response = await axios.get(`${API_BASE_URL}/userdetails/me/photo`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach JWT token
        },
      });
        console.log(response.data.photoUrl);
  
      return response.data.photoUrl;
    } catch (error) {
      console.error("Error fetching profile photo:", error);
      throw error;
    }
  };
  
  export const uploadProfilePhoto = async (file: File) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("photo", file); // The API expects "photo" as the key
  
    const response = await axios.post(`${API_BASE_URL}/userdetails/upload-photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  
    return response.data;
  };
  export const updateUser = async (email: string, userData: { name: string; email: string; password: string }, token: string | null) => {
    try {
      const response = await fetch(`https://localhost:7052/api/User/email/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update user details");
      }
  
      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "An error occurred while updating user details.");
    }
  };

  export const addUserDetails = async (userData: any, token: string) => {
    const response = await fetch("https://localhost:7052/api/userdetails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Failed to add user details.");
    return response.json();
};


  
  
//   export const addUserDetails = async (userId: number, gender: string ,birthDate: string, joiningDate: string, qualifications: string, workedInJapan: boolean, photoPath: string, token: string | null) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/userdetails`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId,gender,birthDate,joiningDate,qualifications,workedInJapan,photoPath }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to add user details");
//       }  
//     }
//     catch (error) {
//       throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
//     }
// }