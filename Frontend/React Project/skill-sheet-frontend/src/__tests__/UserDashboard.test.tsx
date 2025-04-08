import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../pages/UserDashboard';
import { BrowserRouter } from 'react-router-dom';
import { useUserDashboard } from '../hooks/useUserDashboard';
jest.mock('../hooks/useUserDashboard'); // top of file
// Mock react-router's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock useAuth
const mockLogout = jest.fn();
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout
  })
}));

// Mock useUserDashboard
jest.mock('../hooks/useUserDashboard', () => ({
  useUserDashboard: jest.fn(() => ({
    loading: false,
    error: '',
    activeTab: 'profile',
    setActiveTab: jest.fn(),
    user: { name: 'John Doe' },
    updatedUserDetail: { name: 'John Doe', email: 'john@example.com' },
    setUpdatedUserDetail: jest.fn(),
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    photo: '/test-photo.jpg',
    handleImageUpload: jest.fn()
  }))
}));

// Mocks for children components
jest.mock('../components/Navbar', () => ({ HandleLogout, title }: any) => (
  <div data-testid="navbar">
    <button onClick={HandleLogout}>Logout</button>
    <h1>{title}</h1>
  </div>
));

jest.mock('../components/Profile', () => () => (
  <div data-testid="profile-component">Profile Component</div>
));

jest.mock('../components/Skills', () => () => (
  <div data-testid="skills-component">Skills Component</div>
));

describe('Dashboard', () => {
  const renderDashboard = () =>
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

  it('renders dashboard with profile tab by default', () => {
    renderDashboard();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByTestId('profile-component')).toBeInTheDocument();
  });

  it('renders profile picture with test image', () => {
    renderDashboard();
    const img = screen.getByAltText('Profile') as HTMLImageElement;
    expect(img.src).toContain('/test-photo.jpg');
  });

  it('calls logout and navigates to login on logout click', () => {
    renderDashboard();
    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders loading state', () => {
    (useUserDashboard as jest.Mock).mockReturnValue({
      loading: true,
      error: '',
      activeTab: 'profile',
      setActiveTab: jest.fn(),
      user: { name: 'John Doe' },
      updatedUserDetail: { name: 'John Doe', email: 'john@example.com' },
      setUpdatedUserDetail: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      photo: '',
      handleImageUpload: jest.fn()
    });
  
    renderDashboard();
  
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0); // Spinner exists
  });

  it('renders error state', () => {
    jest.mocked(useUserDashboard).mockReturnValue({
      ...useUserDashboard(),
      loading: false,
      error: 'Something went wrong'
    });
    renderDashboard();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
