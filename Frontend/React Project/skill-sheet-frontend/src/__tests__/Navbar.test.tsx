// __tests__/CustomNavbar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import CustomNavbar from '../components/Navbar';

jest.mock('../components/AllModals', () => ({
  ChangePasswordModal: ({ show, onClose, userEmail }: { show: boolean; onClose: () => void; userEmail: string }) => (
    show ? (
      <div>
        <div>Change Password Modal</div>
        <button onClick={onClose}>Close Modal</button>
        <div>{userEmail}</div>
      </div>
    ) : null
  )
}));

describe('CustomNavbar', () => {
  const mockLogout = jest.fn();
  const mockEmail = 'test@example.com';

  beforeEach(() => {
    localStorage.setItem('email', mockEmail);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders correctly with title and logo', () => {
    render(<CustomNavbar title="Dashboard" HandleLogout={mockLogout} />);
    expect(screen.getByText('Skill Sheet')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByAltText('Admin Logo')).toBeInTheDocument();
  });

  it('opens and closes the Change Password modal', () => {
    render(<CustomNavbar title="Dashboard" HandleLogout={mockLogout} />);

    const changePasswordBtn = screen.getByRole('button', { name: /change password/i });
    fireEvent.click(changePasswordBtn);

    expect(screen.getByText('Change Password Modal')).toBeInTheDocument();
    expect(screen.getByText(mockEmail)).toBeInTheDocument();

    const closeModalBtn = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeModalBtn);

    expect(screen.queryByText('Change Password Modal')).not.toBeInTheDocument();
  });

  it('calls HandleLogout on logout button click', () => {
    render(<CustomNavbar title="Dashboard" HandleLogout={mockLogout} />);
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
