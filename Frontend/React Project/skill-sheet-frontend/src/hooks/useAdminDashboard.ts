import { useEffect, useState } from "react";
import { ApiUserResponse } from "../data/types/ApiUserResponse";
import { getUsers, deleteUser } from "../services/adminService";

export const useAdminDashboard = () => {
  // State for Users
  const [users, setUsers] = useState<ApiUserResponse[]>([]);
  const [sortedUsers, setSortedUsers] = useState<ApiUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<"name" | "email">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // State for Actions (Edit/Delete)
  const [selectedUser, setSelectedUser] = useState<ApiUserResponse | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState<ApiUserResponse | null>(null);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is null");
        }
        const data = await getUsers(token);
        setUsers(data);
        setSortedUsers(data);
      } catch {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Sorting Function
  const  handleSort = (column: "name" | "email") => {
    const newOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    const sorted = [...sortedUsers].sort((a, b) =>
      newOrder === "asc" ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column])
    );
    setSortedUsers(sorted);
    setSortColumn(column);
    setSortOrder(newOrder);
  };

  // Search Function
  useEffect(() => {
    if (searchTerm === "") {
      setSortedUsers(users);
    } else {
      setSortedUsers(users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  }, [searchTerm, users]);

  // Delete User
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await deleteUser(selectedUser.email, token);
        setUsers(users.filter(user => user.email !== selectedUser.email));
      } else {
        console.error("Error: Token is null");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setShowDeleteModal(false);
  };

  return {
    users,
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
    showDeleteModal,
    setShowDeleteModal,
    showEditModal,
    setShowEditModal,
    editUser,
    setEditUser,
    handleDeleteUser,
    setUsers,
  };
};
