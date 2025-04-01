import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails, fetchUser, updateUserDetails, uploadProfilePhoto } from "../services/userService";
import { UserDetailApiResponse, UserApiResponse } from "../data/types/UserTypes";
import DefaultPhoto from "../assets/defaultprofile.png";
import { toast, Bounce } from "react-toastify";
export const useUserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "skills">("profile");
  const [usersDetail, setUsersDetail] = useState<UserDetailApiResponse>({
    userId: 0,
    gender: "Male",
    birthDate: "",
    joiningDate: "",
    qualifications: "",
    workedInJapan: true,
    photoPath: "",
  });
  const [user, setUser] = useState<UserApiResponse>({ userId: 0, name: "", email: "" });
  const [updatedUserDetail, setUpdatedUserDetail] = useState(usersDetail);
  const [photo, setPhoto] = useState<string>(DefaultPhoto);
  const navigate = useNavigate();
  const showToast = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        });
    } else {
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        });
    }
  };
  useEffect(() => { 
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Fetch user profile first
        const userProfile = await fetchUser();
        localStorage.setItem("userId", userProfile.userId.toString());
        setUser(userProfile);
  
        try {
          // Fetch user details separately, if it fails, redirect
          const userDetails = await fetchUserDetails();
          setUsersDetail(userDetails);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          navigate("/postdetails"); // Only redirect if fetching user details fails
          return; // Stop further execution
        }
  
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("Failed to fetch user profile. Please try again."); // Show error in UI
      } finally {
        setLoading(false);
      }
    };
  
    loadUserData();
  }, [navigate]);
  useEffect(() => {
    console.log("User Detail Photo", usersDetail.photoPath);
    // Set profile photo with cache-busting timestamp
    setPhoto(`https://localhost:7052${usersDetail.photoPath}?${Date.now()}`);
    console.log("Photo", photo);
    setUsersDetail(usersDetail);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [usersDetail]);
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
  
    if (!file) return;
  
    try {
      setLoading(true);
      setError(null); // Clear previous errors
  
      const response = await uploadProfilePhoto(file);
  
      if (!response || !response.photoPath) {
        throw new Error("Invalid response from server");
      }
  
      console.log("Uploaded Photo Path:", response.photoPath);
  
      // Update user details state first
      setUsersDetail((prevDetails) => {
        const updatedDetails = { ...prevDetails, photoPath: response.photoPath };
        return updatedDetails;
      });
  
      // Wait for state update, then refresh photo
      setTimeout(() => {
        setPhoto(`https://localhost:7052${response.photoPath}?${Date.now()}`);
      }, 100); // Small delay to ensure state update
      showToast("Profile Photo updated successfully!", "success");
    } catch (error) {
      console.error("Failed to upload profile photo:", error);
      setError("Failed to upload profile photo. Please try again.");
      showToast("Failed to upload profile photo. Please try again.", "error");
    } finally {
      fileInput.value = "";
      setLoading(false);
    }
  };

  useEffect(() => {
    setUpdatedUserDetail(usersDetail);
  }, [usersDetail]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    let newValue: string | boolean = e.target.value;
    if (e.target.name === "workedInJapan") {
      newValue = e.target.value === "true";
    }
    setUpdatedUserDetail({ ...updatedUserDetail, [e.target.name]: newValue });
  };

  const handleSubmit = async () => {
    try {
      await updateUserDetails(updatedUserDetail);
      console.log("Success: User details updated");
      showToast("User details updated successfully!", "success");
    } catch (error) {
      showToast("Failed to update user details", "error");
      console.error("Failed to update user details", error);
    }
  };

  return {
    loading,
    error,
    activeTab,
    setActiveTab,
    user,
    usersDetail,
    updatedUserDetail,
    photo,
    handleChange,
    handleSubmit,
    handleImageUpload,
  };
};
