import React from 'react';
import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import adminLogo from '../assets/adminPageLogo.jpg';
import { ChangePasswordModal } from './AllModals';
import "../styles/mynavbar.css";

interface NavbarProps {
  title: string;
  HandleLogout: () => void;
}

const CustomNavbar: React.FC<NavbarProps> = ({ title, HandleLogout }) => {
  const [showChangePasswordModal, setShowChangePasswordModal] = React.useState(false);

  return (
    <>
      <Navbar expand="lg" className="custom-navbar shadow-sm">
        <Container fluid>
          {/* Navbar Brand */}
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <img
              src={adminLogo}
              height="45"
              alt="Admin Logo"
              className="me-2 rounded-circle border shadow-sm"
            />
            <span className="brand-title">Skill Sheet</span>
          </Navbar.Brand>

          {/* Toggle Button */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

          {/* Collapsible Navbar Content */}
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between" role="region">
            {/* Centered Title */}
            <div className="navbar-title-container justify-content-center text-center">
              <h5 className="navbar-title">{title}</h5>
            </div>

            {/* Buttons */}
            <Nav className="ms-auto d-flex gap-2 align-items-center">
              <Button
                variant="warning"
                className="nav-button change-password-btn text-nowrap"
                onClick={() => setShowChangePasswordModal(true)}
              >
                Change Password
              </Button>
              <Button
                variant="danger"
                className="nav-button logout-btn"
                onClick={HandleLogout}
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Change Password Modal */}
      <ChangePasswordModal
        show={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        userEmail={localStorage.getItem("email")}
        
      />
    </>
  );
};

export default CustomNavbar;
