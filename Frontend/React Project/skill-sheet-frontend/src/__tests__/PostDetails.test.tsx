import { render, screen, fireEvent } from '@testing-library/react';
import PostDetails from '../pages/PostDetails';
import { usePostDetails as mockUsePostDetails } from '../hooks/usePostDetails';
import { useAuth as mockUseAuth } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../hooks/usePostDetails');
jest.mock('../context/AuthContext');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('PostDetails Component', () => {
  const mockHandlePost = jest.fn((e) => e.preventDefault());
  const mockHandleChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (mockUseAuth as jest.Mock).mockReturnValue({
      logout: jest.fn(),
    });

    (mockUsePostDetails as jest.Mock).mockReturnValue({
      user: {
        email: 'test@example.com',
        name: 'John Doe',
      },
      formData: {
        birthDate: '2000-01-01',
        gender: 'Male',
        joiningDate: '2022-01-01',
        workedInJapan: true,
        qualifications: 'Bachelors in CS',
      },
      handleChange: mockHandleChange,
      handlePost: mockHandlePost,
      errors: {
        birthDate: '',
        gender: '',
        joiningDate: '',
        qualifications: '',
      },
      getTodayDate: () => '2025-04-07',
    });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <PostDetails />
      </MemoryRouter>
    );

  it('renders the form with default values', () => {
    renderComponent();

    expect(screen.getByText('Personal Details')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2022-01-01')).toBeInTheDocument();
    expect(screen.getByText('Bachelors in CS')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('calls handlePost on form submit', () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    expect(mockHandlePost).toHaveBeenCalled();
  });

  it('calls handleChange on input change', () => {
    renderComponent();

    const qualificationField = screen.getByPlaceholderText('Enter your qualification');
    fireEvent.change(qualificationField, { target: { value: 'Masters in IT' } });

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('shows validation errors if present', () => {
    (mockUsePostDetails as jest.Mock).mockReturnValueOnce({
      ...mockUsePostDetails({ navigate: mockNavigate }),
      errors: {
        birthDate: 'Invalid birthdate',
        gender: 'Please select gender',
        joiningDate: 'Required',
        qualifications: 'Too short',
      },
    });

    renderComponent();

    expect(screen.getByText('Invalid birthdate')).toBeInTheDocument();
    expect(screen.getByText('Please select gender')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });
});
