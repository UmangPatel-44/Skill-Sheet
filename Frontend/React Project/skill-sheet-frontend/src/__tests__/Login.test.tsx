import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: jest.fn(),
  })) as unknown as typeof IntersectionObserver;
});
import { useLogin as mockUseLogin } from '../hooks/useAuth';

jest.mock('../hooks/useAuth');

describe('Login Component', () => {
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (mockUseLogin as jest.Mock).mockReturnValue({
      email: '',
      setEmail: jest.fn(),
      password: '',
      setPassword: jest.fn(),
      role: 'User',
      setRole: jest.fn(),
      users: ['user1@example.com', 'admin@example.com'],
      handleSubmit: mockHandleSubmit,
      errors: {
        email: '',
        password: '',
        role: ''
      }
    });
  });

  it('renders login form correctly', () => {
    render(<Login />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders user emails in the dropdown', () => {
    render(<Login />);
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
  });

  it('calls handleSubmit when login button is clicked', () => {
    render(<Login />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('shows validation error messages when present', () => {
    (mockUseLogin as jest.Mock).mockReturnValue({
      email: '',
      setEmail: jest.fn(),
      password: '',
      setPassword: jest.fn(),
      role: '',
      setRole: jest.fn(),
      users: [],
      handleSubmit: mockHandleSubmit,
      errors: {
        email: 'Email is required',
        password: 'Password is required',
        role: 'Role is required'
      }
    });

    render(<Login />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Role is required')).toBeInTheDocument();
  });
});
