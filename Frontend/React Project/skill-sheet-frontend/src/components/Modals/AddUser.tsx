import React from "react";
import { useAddUser } from "../../hooks/useAddUser";

interface AddUserProps {
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUser: React.FC<AddUserProps> = ({ onClose, onUserAdded }) => {
  const { formData, loading, error, passwordError, handleChange, handleSubmit } = useAddUser(
    onUserAdded,
    onClose
  );

  return (
    <div className="container px-3 py-1">
      <div className="row">
        <div className="col-12">
          {error && <p className="text-danger text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-bold">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {passwordError && <p className="text-danger">{passwordError}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label fw-bold">Role:</label>
              <select id="role" className="form-control" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading || !!passwordError}>
              {loading ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
