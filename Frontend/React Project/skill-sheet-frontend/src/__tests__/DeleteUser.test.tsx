import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteUser from "../components/Modals/DeleteUser";
import '@testing-library/jest-dom';

const mockProps = {
  show: true,
  onClose: jest.fn(),
  onDelete: jest.fn(),
  userName: "John Doe"
};

describe("DeleteUser Modal", () => {
  it("renders modal with correct user name and text", () => {
    render(<DeleteUser {...mockProps} />);

    expect(screen.getByTestId("confirmDeleteTitle")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete the user :")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirm Delete/i })).toBeInTheDocument();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<DeleteUser {...mockProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("calls onDelete when Confirm Delete button is clicked", () => {
    render(<DeleteUser {...mockProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Confirm Delete/i }));
    expect(mockProps.onDelete).toHaveBeenCalled();
  });
});
