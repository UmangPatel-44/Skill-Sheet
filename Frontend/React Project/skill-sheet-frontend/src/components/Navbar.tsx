import React from 'react';
import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import adminLogo from '../assets/adminPageLogo.jpg';
import { ChangePasswordModal } from './AllModals';

interface NavbarProps {
  title: string;
  HandleLogout: () => void;
}

const CustomNavbar: React.FC<NavbarProps> = ({ title, HandleLogout }) => {
  const [showChangePasswordModal, setShowChangePasswordModal] = React.useState(false);

  return (
    <>
      <Navbar expand="lg" style={{ background: '#A3D1C6', padding: '0.3rem 1rem' }} className="shadow-sm">
        <Container fluid>
          {/* Navbar Brand */}
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <img src={adminLogo} height="40" alt="Admin Logo" className="me-2" />
            <span style={{ fontSize: '1rem' }}>Skill Sheet</span>
          </Navbar.Brand>

          {/* Toggle Button */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Collapsible Navbar Content */}
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between align-items-center">
            {/* Centered Title */}
            <div className="w-100 text-center">
              <h5 className="fw-bold mb-0">{title}</h5>
            </div>

            {/* Buttons */}
            <Nav className="ms-auto d-flex flex-column flex-lg-row gap-2 mt-2 mt-lg-0 align-items-center">
              <Button
                variant="warning"
                className="opacity-75"
                style={{
                  whiteSpace: 'nowrap',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.9rem',
                }}
                onClick={() => setShowChangePasswordModal(true)}
              >
                Change Password
              </Button>
              <Button
                variant="danger"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.9rem' }}
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
