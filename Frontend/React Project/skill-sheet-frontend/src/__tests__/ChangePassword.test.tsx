import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import ChangePassword from "../components/Modals/ChangePassword";

// Correct import path for your hook relative to THIS test file
import { useChangePassword } from "../hooks/useChangePassword";

// Mock the hook
jest.mock("../hooks/useChangePassword");

const mockOnClose = jest.fn();

const mockHookReturn = {
  oldPassword: "",
  setOldPassword: jest.fn(),
  newPassword: "",
  setNewPassword: jest.fn(),
  confirmPassword: "",
  setConfirmPassword: jest.fn(),
  errors: {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
  isFormValid: false,
  loading: false,
  error: "",
  handlePasswordChange: jest.fn(),
};

describe("ChangePassword Component", () => {
  beforeEach(() => {
    // Type assertion to let TS know it's a mocked function
    (useChangePassword as jest.Mock).mockReturnValue(mockHookReturn);
  });

  it("renders the modal with form fields and buttons", () => {
    render(
      <ChangePassword
        show={true}
        onClose={mockOnClose}
        userEmail="test@example.com"
      />
    );

    expect(screen.getAllByText(/Change Password/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Old Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText('New Password', { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm New Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Change Password/i })).toBeInTheDocument();
  });

  it("disables the Change Password button when form is invalid", () => {
    render(
      <ChangePassword
        show={true}
        onClose={mockOnClose}
        userEmail="test@example.com"
      />
    );

    expect(screen.getByRole("button", { name: /Change Password/i })).toBeDisabled();
  });

  it("calls onClose when Cancel is clicked", () => {
    render(
      <ChangePassword
        show={true}
        onClose={mockOnClose}
        userEmail="test@example.com"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
