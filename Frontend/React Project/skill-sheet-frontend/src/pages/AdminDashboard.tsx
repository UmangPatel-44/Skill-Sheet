import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { AddUserModal, EditUserModal, DeleteUserModal } from "../components/AllModals";
import { Spinner } from "react-bootstrap";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const {
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
    showAddUserModal,
    setShowAddUserModal,
    totalPages,
    currentUsers,
    currentPage,
    setCurrentPage
    
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
            <button className="btn btn-primary w-100 w-md-auto" onClick={() => setShowAddUserModal(true)}>
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
              {currentUsers.map((user) => (
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
        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-4">
          <button 
            className="btn btn-outline-secondary mx-2" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button 
            className="btn btn-outline-secondary mx-2" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Modals */}
        <AddUserModal show={showAddUserModal} onClose={() => setShowAddUserModal(false)} onUserAdded={() => window.location.reload()} />
        <EditUserModal show={showEditModal} onClose={() => setShowEditModal(false)} user={editUser} onUserUpdated={() => window.location.reload()} />
        <DeleteUserModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={handleDeleteUser} userName={selectedUser?.name ?? null} />
      </div>
    </div>
  );
};

export default AdminDashboard;
