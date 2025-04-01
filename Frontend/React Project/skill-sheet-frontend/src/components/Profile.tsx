import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProfileProps } from "../data/types/ProfileProps";

const Profile: React.FC<ProfileProps> = ({ user, usersDetail, handleChange, handleSubmit }) => {
  const [errors, setErrors] = useState({
    birthDate: "",
    joiningDate: "",
    gender: "",
    qualifications: "",
  });

  useEffect(() => {
    console.log("Received updated user details in Profile:", usersDetail);
  }, [usersDetail]);

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { birthDate: "", joiningDate: "", gender: "", qualifications: "" };

    // Birthdate
    if (!usersDetail.birthDate) {
      newErrors.birthDate = "Birthdate is required.";
      valid = false;
    } else if (new Date(usersDetail.birthDate) > new Date()) {
      newErrors.birthDate = "Birthdate cannot be in the future.";
      valid = false;
    }

    // Joining Date
    if (!usersDetail.joiningDate) {
      newErrors.joiningDate = "Joining date is required.";
      valid = false;
    } else if (new Date(usersDetail.joiningDate) > new Date()) {
      newErrors.joiningDate = "Joining date cannot be in the future.";
      valid = false;
    }

    // Gender
    if (!usersDetail.gender.trim()) {
      newErrors.gender = "Gender is required.";
      valid = false;
    }

    // Qualifications
    if (!usersDetail.qualifications.trim()) {
      newErrors.qualifications = "Qualification is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onSubmit = () => {
    if (validateForm()) {
      handleSubmit();
    }
  };

  return (
    <div className="container py-4">
      <div className="card  border-0 rounded-4">
        <div className="card-header text-center text-md-start rounded-top-4 fs-4 fw-bold">
          Personal Details
        </div>
        <div className="card-body p-4">
          <form>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input className="form-control fs-6 fs-md-5 bg-light" type="text" value={user.email} readOnly />
            </div>

            {/* Name, Birthdate, Gender, Joining Date */}
            <div className="row row-cols-1 row-cols-md-2 gx-4 gy-3">
              {/* Name */}
              <div className="col">
                <label className="form-label fw-semibold">Name</label>
                <input className="form-control fs-6 fs-md-5 bg-light" type="text" value={user.name} readOnly />
              </div>

              {/* Birthdate */}
              <div className="col">
                <label className="form-label fw-semibold">Birthdate</label>
                <input
                  className="form-control fs-6 fs-md-5"
                  name="birthDate"
                  type="date"
                  max={getTodayDate()}
                  value={usersDetail.birthDate}
                  onChange={handleChange}
                />
                {errors.birthDate && <div className="text-danger mt-1">{errors.birthDate}</div>}
              </div>

              {/* Gender */}
              <div className="col">
                <label className="form-label fw-semibold">Gender</label>
                <input
                  className="form-control fs-6 fs-md-5"
                  name="gender"
                  type="text"
                  value={usersDetail.gender}
                  onChange={handleChange}
                />
                {errors.gender && <div className="text-danger mt-1">{errors.gender}</div>}
              </div>

              {/* Joining Date */}
              <div className="col">
                <label className="form-label fw-semibold">Joining Date</label>
                <input
                  className="form-control fs-6 fs-md-5"
                  name="joiningDate"
                  type="date"
                  max={getTodayDate()}
                  value={usersDetail.joiningDate}
                  onChange={handleChange}
                />
                {errors.joiningDate && <div className="text-danger mt-1">{errors.joiningDate}</div>}
              </div>
            </div>

            {/* Worked in Japan & Qualification */}
            <div className="row row-cols-1 row-cols-md-2 gx-4 gy-3 mt-3">
              {/* Worked In Japan */}
              <div className="col">
                <label className="form-label fw-semibold">Worked In Japan</label>
                <select
                  className="form-select fs-6 fs-md-5"
                  name="workedInJapan"
                  value={usersDetail.workedInJapan ? "true" : "false"}
                  onChange={handleChange}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              {/* Qualification */}
              <div className="col">
                <label className="form-label fw-semibold">Qualification</label>
                <textarea
                  className="form-control fs-6 fs-md-5"
                  name="qualifications"
                  placeholder="Enter your qualification"
                  value={usersDetail.qualifications}
                  onChange={handleChange}
                  rows={3}
                />
                {errors.qualifications && <div className="text-danger mt-1">{errors.qualifications}</div>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center text-md-start mt-4">
              <button
                className="btn btn-primary px-5 py-2 fw-semibold fs-6 fs-md-5 rounded-pill shadow-sm"
                type="button"
                onClick={onSubmit}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
