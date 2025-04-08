import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProfileProps } from "../data/types/ProfileProps";
import useProfileForm from "../hooks/useProfileForm";

const Profile: React.FC<ProfileProps> = ({ user, usersDetail: initialUserDetail, handleSubmit }) => {
  const { usersDetail, errors, getTodayDate, handleChange, onSubmit } = useProfileForm({
    initialUserDetail,
    handleSubmit,
  });

  return (
    <div className="card mb-4 ">

        <div className="card-header text-center text-md-start rounded-top-4 fs-4 fw-bold">
          Personal Details
        </div>
        <div className="card-body p-4">
          <form>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input className="form-control fs-6 fs-md-5 bg-light" type="text" value={user.email} readOnly />
            </div>

            <div className="row row-cols-1 row-cols-md-2 gx-4 gy-3">
              <div className="col">
                <label className="form-label fw-semibold">Name</label>
                <input className="form-control fs-6 fs-md-5 bg-light" type="text" value={user.name} readOnly />
              </div>

              <div className="col">
                <label className="form-label fw-semibold"htmlFor="birthdate">Birthdate</label>
                <input
                  className="form-control fs-6 fs-md-5"
                  name="birthDate"
                  type="date"
                  id="birthdate"
                  max={getTodayDate()}
                  value={usersDetail.birthDate}
                  onChange={handleChange}
                />
                {errors.birthDate && <div className="text-danger mt-1">{errors.birthDate}</div>}
              </div>

              <div className="col">
              <label className="form-label fw-semibold">Gender</label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={usersDetail.gender === "Male"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Male</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={usersDetail.gender === "Female"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Female</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={usersDetail.gender === "Other"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Other</label>
                </div>
              </div>
              {errors.gender && <div className="text-danger mt-1">{errors.gender}</div>}
            </div>

              <div className="col">
                <label className="form-label fw-semibold"htmlFor="joiningDate">Joining Date</label>
                <input
                  className="form-control fs-6 fs-md-5"
                  name="joiningDate"
                  type="date"
                  id="joiningDate"
                  max={getTodayDate()}
                  value={usersDetail.joiningDate}
                  onChange={handleChange}
                />
                {errors.joiningDate && <div className="text-danger mt-1">{errors.joiningDate}</div>}
              </div>
            </div>

            <div className="row row-cols-1 row-cols-md-2 gx-4 gy-3 mt-3">
              <div className="col">
                <label className="form-label fw-semibold"htmlFor="workedInJapan">Worked In Japan</label>
                <select
                  className="form-select fs-6 fs-md-5"
                  name="workedInJapan"
                  id="workedInJapan"
                  value={usersDetail.workedInJapan ? "true" : "false"}
                  onChange={handleChange}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="col">
                <label className="form-label fw-semibold"htmlFor="qualification">Qualification</label>
                <textarea
                  className="form-control fs-6 fs-md-5"
                  name="qualifications"
                  id="qualification"
                  placeholder="Enter your qualification"
                  value={usersDetail.qualifications}
                  onChange={handleChange}
                  rows={3}
                />
                {errors.qualifications && <div className="text-danger mt-1">{errors.qualifications}</div>}
              </div>
            </div>

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
  );
};

export default Profile;