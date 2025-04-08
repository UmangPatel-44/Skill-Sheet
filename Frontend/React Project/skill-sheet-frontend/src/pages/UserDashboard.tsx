import { useRef } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import Skills from "../components/Skills";
import { useUserDashboard } from "../hooks/useUserDashboard";
// import useProfilePhoto from "../hooks/useProfilePhoto"; 
import { ToastContainer,Bounce } from "react-toastify";
const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const {
    loading,
    error,
    activeTab,
    setActiveTab,
    user,
    updatedUserDetail,
    setUpdatedUserDetail,
    handleChange,
    handleSubmit,
    photo,
    handleImageUpload
  } = useUserDashboard();

  // const {  loading: photoLoading, error: photoError } = useProfilePhoto();

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Trigger file input when button is clicked
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div>
      <Navbar HandleLogout={handleLogout} title="User Dashboard" />
      
      <div className="container-xl px-4 mt-4">
      <ToastContainer
position="top-right"
autoClose={3000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
transition={Bounce}
/>
        {loading && <Spinner animation="border" role="status" />}
        {error ? <p className="text-danger">{error}</p> : (
          <div className="row">
            <div className="col-xl-4">
              <div className="card mb-4 mb-xl-0 mt-5">
                <div className="card-header">Profile Picture</div>
                <div className="card-body text-center">
                  {loading ? (
                    <Spinner animation="border" role="status" />
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : (
                    <img className="img-account-profile rounded-circle mb-2 h-50 w-50" 
                          key={photo}
                          src={photo || "/default-profile.png"} 
                         alt="Profile" />
                  )}
                  <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                  
                  {/* Hidden file input */}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    style={{ display: "none" }} 
                    onChange={handleImageUpload} 
                  />
                  
                  {/* Button triggers file input */}
                  <button className="btn btn-primary" onClick={handleButtonClick}>
                    Upload new image
                  </button>
                </div>
              </div>
            </div>

            <div className="col-xl-8">
              <nav className="nav nav-borders">
                <button className={`nav-link ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
                  Profile
                </button>
                <button className={`nav-link ${activeTab === "skills" ? "active" : ""}`} onClick={() => setActiveTab("skills")}>
                  Skills
                </button>
              </nav>
              <hr className="mt-0 mb-4" />
              {activeTab === "profile" ? (
               <Profile
               user={user}
               usersDetail={updatedUserDetail}
               setUsersDetail={setUpdatedUserDetail}
               handleChange={handleChange}
               handleSubmit={handleSubmit}
             />
             
              ) : (
                <Skills />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;