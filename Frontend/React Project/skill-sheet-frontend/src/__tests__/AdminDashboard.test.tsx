// src/__tests__/AdminDashboard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '../pages/AdminDashboard';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { useAuth } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../hooks/useAdminDashboard');
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));
jest.mock('../components/AllModals', () => ({
  AddUserModal: ({ show }: { show: boolean }) => show ? <div data-testid="add-user-modal" /> : null,
  EditUserModal: ({ show }: {show: boolean}) => show ? <div data-testid="edit-user-modal" /> : null,
  DeleteUserModal: ({ show }: {show: boolean}) => show ? <div data-testid="delete-user-modal" /> : null
}));
jest.mock('../components/Navbar', () => ({ HandleLogout, title }: { HandleLogout: () => void; title: string }) => (
  <div>
    <button onClick={HandleLogout}>Logout</button>
    <h1>{title}</h1>
  </div>
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('AdminDashboard', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useAdminDashboard as jest.Mock).mockReturnValue({
      loading: false,
      error: '',
      searchTerm: '',
      setSearchTerm: jest.fn(),
      handleSort: jest.fn(),
      sortColumn: 'name',
      sortOrder: 'asc',
      selectedUser: null,
      setSelectedUser: jest.fn(),
      editUser: null,
      setEditUser: jest.fn(),
      showEditModal: false,
      setShowEditModal: jest.fn(),
      showDeleteModal: false,
      setShowDeleteModal: jest.fn(),
      handleDeleteUser: jest.fn(),
      showAddUserModal: false,
      setShowAddUserModal: jest.fn(),
      totalPages: 2,
      currentPage: 1,
      setCurrentPage: jest.fn(),
      currentUsers: [
        { userId: 1, name: 'John Doe', email: 'john@example.com' },
        { userId: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ]
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

  it('renders dashboard title', () => {
    renderComponent();
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('displays users in the table', () => {
    renderComponent();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('calls logout and navigates to login on logout click', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('shows Add User modal when Add User button is clicked', async () => {
    const setShowAddUserModal = jest.fn();
    (useAdminDashboard as jest.Mock).mockReturnValueOnce({
      ...useAdminDashboard(),
      showAddUserModal: true,
      setShowAddUserModal
    });

    renderComponent();
    expect(screen.getByTestId('add-user-modal')).toBeInTheDocument();
  });

  it('paginates correctly', () => {
    renderComponent();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
