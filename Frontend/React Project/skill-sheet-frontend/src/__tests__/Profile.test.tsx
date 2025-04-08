import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "../components/Profile";
import { ProfileProps } from "../data/types/ProfileProps";
import * as useProfileFormHook from "../hooks/useProfileForm";

describe("Profile Component", () => {
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();

  const mockUser = { name: "John Doe", email: "john@example.com" };
  const mockUserDetail = {
    birthDate: "1990-01-01",
    gender: "Male",
    joiningDate: "2015-01-01",
    qualifications: "B.Sc. Computer Science",
    workedInJapan: true,
  };

  beforeEach(() => {
    jest.spyOn(useProfileFormHook, "default").mockReturnValue({
      usersDetail: mockUserDetail,
      errors: {
        birthDate: "",
        joiningDate: "",
        gender: "",
        qualifications: "",
      },
      getTodayDate: () => "2025-04-04",
      handleChange: mockHandleChange,
      onSubmit: mockHandleSubmit,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Profile
        user={mockUser}
        usersDetail={mockUserDetail}
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        setUsersDetail={jest.fn()}
      />
    );

  it("renders user email and name", () => {
    renderComponent();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
  });

  it("renders birthdate, gender, joining date and qualification fields", () => {
    renderComponent();

    expect(screen.getByLabelText("Birthdate")).toBeInTheDocument();
    expect(screen.getByLabelText("Joining Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Qualification")).toBeInTheDocument();
    expect(screen.getByLabelText("Worked In Japan")).toBeInTheDocument();
  });

  it("fires handleChange when input changes", () => {
    renderComponent();
    const qualificationInput = screen.getByPlaceholderText("Enter your qualification");
    fireEvent.change(qualificationInput, { target: { value: "M.Sc." } });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it("fires onSubmit when Save Changes is clicked", () => {
    renderComponent();
    const button = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(button);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("shows validation error messages if provided", () => {
    jest.spyOn(useProfileFormHook, "default").mockReturnValue({
      usersDetail: mockUserDetail,
      errors: {
        birthDate: "Birthdate is required.",
        joiningDate: "",
        gender: "",
        qualifications: "",
      },
      getTodayDate: () => "2025-04-04",
      handleChange: mockHandleChange,
      onSubmit: mockHandleSubmit,
    });

    renderComponent();
    expect(screen.getByText("Birthdate is required.")).toBeInTheDocument();
  });
});
