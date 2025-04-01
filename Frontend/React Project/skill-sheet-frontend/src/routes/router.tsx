import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PostDetails from "../pages/PostDetails";
import Login from "../pages/Login";
import Dashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard"; 
import { useAuth } from "../context/AuthContext";
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    const { user } = useAuth();
  return user&& (user.role === "User") ? element : <Navigate to="/" />;
};
const AdminRoute = ({ element }: { element: JSX.Element }) => {
    const { user } = useAuth();
    console.log("User Role:", user?.role);
    return user && (user.role === "Admin") ? element : <Navigate to="/dashboard" />;
  };
const AppRouter = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/admindashboard" element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path ="/postdetails" element={<PostDetails />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>

    </BrowserRouter>
  );
};

export default AppRouter;
