import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { AddUserModal, EditUserModal, DeleteUserModal } from "../components/AllModals";
import { Spinner } from "react-bootstrap";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const {
    sortedUsers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    handleSort,
    sortColumn,
    sortOrder,
    selectedUser,
    setSelectedUser,
    editUser,
    setEditUser,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    handleDeleteUser,
  } = useAdminDashboard();

  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div>
      {/* Navbar */}
      <Navbar HandleLogout={() => { logout(); navigate("/login"); }} title="Admin Dashboard" />
      
      <div className="container mt-4">
        {/* Search and Add User Section */}
        <div className="row mb-3 align-items-center">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="🔍 Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className=" col-lg-2 col-md-6 text-md-end text-center mt-2 mt-md-0 ms-auto">
            <button className="btn btn-primary w-100 w-md-auto" onClick={() => setShowEditModal(true)}>
              Add User
            </button>
          </div>
        </div>

        {/* Loading & Error Handling */}
        {loading && <div className="d-flex justify-content-center"><Spinner animation="border" role="status" /></div>}
        {error && <p className="text-danger text-center">{error}</p>}

        {/* User Table */}
        <div className="table-responsive">
          <table className="table table-striped table-hover text-center">
            <thead className="table-dark">
              <tr>
                <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                  Name {sortColumn === "name" && (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                  Email {sortColumn === "email" && (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.userId}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="d-flex flex-wrap justify-content-center gap-2">
                    <button className="btn btn-outline-success" onClick={() => { setEditUser(user); setShowEditModal(true); }}>
                      Edit
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <AddUserModal show={showEditModal} onClose={() => setShowEditModal(false)} onUserAdded={() => window.location.reload()} />
        <EditUserModal show={showEditModal} onClose={() => setShowEditModal(false)} user={editUser} onUserUpdated={() => window.location.reload()} />
        <DeleteUserModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={handleDeleteUser} userName={selectedUser?.name ?? null} />
      </div>
    </div>
  );
};

export default AdminDashboard;
