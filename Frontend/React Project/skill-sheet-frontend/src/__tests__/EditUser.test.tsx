import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditUser from '../components/Modals/EditUser';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Correct import path for the hook
jest.mock('../hooks/useEditUser', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useEditUser from '../hooks/useEditUser';

describe('EditUser Component', () => {
  const mockOnClose = jest.fn();
  const mockOnUserUpdated = jest.fn();
  const mockHandleChange = jest.fn();
  const mockHandleUpdate = jest.fn();

  const mockUser = {
    userId: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'secret123',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useEditUser as jest.Mock).mockReturnValue({
      updatedUser: mockUser,
      error: '',
      handleChange: mockHandleChange,
      handleUpdate: mockHandleUpdate,
    });
  });

  it('renders modal with user info', () => {
    render(
      <EditUser
        show={true}
        onClose={mockOnClose}
        user={mockUser}
        onUserUpdated={mockOnUserUpdated}
      />
    );

    expect(screen.getByText('Edit User Details')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('secret123')).toBeInTheDocument();
  });

  it('calls handleChange when name input changes', async () => {
    render(
      <EditUser
        show={true}
        onClose={mockOnClose}
        user={mockUser}
        onUserUpdated={mockOnUserUpdated}
      />
    );

    const nameInput = screen.getByLabelText('Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jane Doe');

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('calls handleUpdate on clicking Update button', () => {
    render(
      <EditUser
        show={true}
        onClose={mockOnClose}
        user={mockUser}
        onUserUpdated={mockOnUserUpdated}
      />
    );

    const updateButton = screen.getByRole('button', { name: /update/i });
    fireEvent.click(updateButton);

    expect(mockHandleUpdate).toHaveBeenCalled();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(
      <EditUser
        show={true}
        onClose={mockOnClose}
        user={mockUser}
        onUserUpdated={mockOnUserUpdated}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays error if error exists in hook', () => {
    (useEditUser as jest.Mock).mockReturnValue({
      updatedUser: mockUser,
      error: 'Something went wrong!',
      handleChange: mockHandleChange,
      handleUpdate: mockHandleUpdate,
    });

    render(
      <EditUser
        show={true}
        onClose={mockOnClose}
        user={mockUser}
        onUserUpdated={mockOnUserUpdated}
      />
    );

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });
});
