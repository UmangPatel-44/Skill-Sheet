import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { usePostDetails } from "../hooks/usePostDetails";

const PostDetails = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { user, formData, handleChange, handlePost, errors,getTodayDate } = usePostDetails(navigate);
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
                                        <input className="form-control" id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} max={getTodayDate()} />
                                        {errors.birthDate && <small className="text-danger">{errors.birthDate}</small>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Gender</label>
                                        {/* <input className="form-control" id="gender" type="text" value={formData.gender} onChange={handleChange} /> */}
                                        <input className="form-check-input" name="gender" type="radio" value="Male" checked={formData.gender==="Male"} />
                                        <label className="form-form-check-label">Male</label>
                                        {errors.gender && <small className="text-danger">{errors.gender}</small>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Joining Date</label>
                                        <input className="form-control" id="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} max={getTodayDate()}/>
                                        {errors.joiningDate && <small className="text-danger">{errors.joiningDate}</small>}
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
                                    {errors.qualifications && <small className="text-danger">{errors.qualifications}</small>}
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