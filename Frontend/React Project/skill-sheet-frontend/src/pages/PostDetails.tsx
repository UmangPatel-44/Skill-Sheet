import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../services/userService';
import { UserApiResponse } from '../data/types/UserTypes';

const PostDetails = () => {
    const [user, setUser] = useState<UserApiResponse>({ userId: 0, name: "", email: "" });
    const navigate = useNavigate();
    const { logout } = useAuth();
    const userId = parseInt(localStorage.getItem("userId") || "0", 10);

    const [formData, setFormData] = useState({
        userId: userId,
        gender: "",
        birthDate: "",
        joiningDate: "",
        qualifications: "",
        workedInJapan: "true",
        photoPath: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: id === "workedInJapan" ? value === "true" : value,
        }));
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.userId) {
            alert("User ID is missing. Please log in again.");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Authentication failed. Please log in again.");
                return;
            }

            const requestBody = {
                ...formData,
                workedInJapan: formData.workedInJapan === "true",
                birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : "",
                joiningDate: formData.joiningDate ? new Date(formData.joiningDate).toISOString().split('T')[0] : "",
            };

            const response = await fetch("https://localhost:7052/api/userdetails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("Failed to add user details.");

            alert("User Details added successfully!");
            setFormData({
                userId: userId,
                gender: "",
                birthDate: "",
                joiningDate: "",
                qualifications: "",
                workedInJapan: "true",
                photoPath: "",
            });
            navigate("/dashboard");
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };
    const getTodayDate = () => 
    {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months start at 0!
        const dd = String(today.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };
    return (
        <div>


        <Navbar HandleLogout={() => { logout(); navigate("/login"); }} title="PostDetails" />
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-xl-6">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-header bg-primary text-white text-center py-3">
                            <h4 className="mb-0">Personal Details</h4>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handlePost}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input className="form-control" type="text" value={user.email} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input className="form-control" type="text" value={user.name} readOnly />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Birthdate</label>
                                        <input
                                        className="form-control"
                                        id="birthDate"
                                        type="date"
                                        max={getTodayDate()}
                                        value={formData.birthDate || ""}
                                        onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Gender</label>
                                        <input className="form-control" id="gender" type="text" value={formData.gender} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Joining Date</label>
                                        <input className="form-control" id="joiningDate" type="date" value={formData.joiningDate || ""}  max={getTodayDate()} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Worked In Japan</label>
                                        <select className="form-select" id="workedInJapan" value={formData.workedInJapan ? "true" : "false"} onChange={handleChange}>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Qualification</label>
                                    <textarea className="form-control" id="qualifications" onChange={handleChange} placeholder="Enter your qualification" value={formData.qualifications} />
                                </div>
                                <div className="d-grid">
                                    <button className="btn btn-primary btn-lg" type="submit">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default PostDetails;
