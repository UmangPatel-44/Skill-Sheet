import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddUser from "../components/Modals/AddUser";
import { useAddUser } from "../hooks/useAddUser";

jest.mock("../hooks/useAddUser");

describe("AddUser Component", () => {
  const mockOnClose = jest.fn();
  const mockOnUserAdded = jest.fn();

  const mockUseAddUser = {
    formData: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    loading: false,
    error: "",
    passwordError: "",
    handleChange: jest.fn(),
    handleSubmit: jest.fn((e) => e.preventDefault()),
  };

  beforeEach(() => {
    (useAddUser as jest.Mock).mockReturnValue(mockUseAddUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields and the submit button", () => {
    render(<AddUser onClose={mockOnClose} onUserAdded={mockOnUserAdded} />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add User/i })).toBeInTheDocument();
  });

  it("displays error message if error exists", () => {
    (useAddUser as jest.Mock).mockReturnValue({
      ...mockUseAddUser,
      error: "An error occurred",
    });

    render(<AddUser onClose={mockOnClose} onUserAdded={mockOnUserAdded} />);
    expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
  });

  it("displays password error if passwordError exists", () => {
    (useAddUser as jest.Mock).mockReturnValue({
      ...mockUseAddUser,
      passwordError: "Password is too weak",
    });

    render(<AddUser onClose={mockOnClose} onUserAdded={mockOnUserAdded} />);
    expect(screen.getByText(/Password is too weak/i)).toBeInTheDocument();
  });

  it("calls handleChange when input fields are changed", () => {
    render(<AddUser onClose={mockOnClose} onUserAdded={mockOnUserAdded} />);

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(mockUseAddUser.handleChange).toHaveBeenCalled();

    const emailInput = screen.getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(mockUseAddUser.handleChange).toHaveBeenCalled();
  });

  it("calls handleSubmit when the form is submitted", () => {
    render(<AddUser onClose={mockOnClose} onUserAdded={mockOnUserAdded} />);

    const form = screen.getByTestId("add-user-form");
    fireEvent.submit(form);
    expect(mockUseAddUser.handleSubmit).toHaveBeenCalled();
  });

  it("disables the submit button when loading or passwordError exists", () => {
    (useAddUser as jest.Mock).mockReturnValue({
      ...mockUseAddUser,
      loading: true,
    });

    render(<AddUser onClose={mockOnClose} onUserAdded={mockOnUserAdded} />);
    const button = screen.getByRole("button", { name: /Adding.../i });
    expect(button).toBeDisabled();
  });
});
