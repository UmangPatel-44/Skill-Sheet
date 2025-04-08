import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddSkills from "../components/Modals/AddSkills";
import { Skill } from "../data/types/Skills";
import '@testing-library/jest-dom';

const mockSkills: Skill[] = [
  { skillId: 1, skillName: "React" },
  { skillId: 2, skillName: "TypeScript" },
];

const mockCategories = ["Frontend", "Backend"];

const mockProps = {
  show: true,
  handleClose: jest.fn(),
  handleSave: jest.fn(),
  skills: mockSkills,
  categoryList: mockCategories,
  selectedCategory: "",
  setSelectedCategory: jest.fn(),
  selectedSkills: [],
  setSelectedSkills: jest.fn(),
  experience: "",
  setExperience: jest.fn(),
  userSkills: [], // Added userSkills property
};

describe("AddSkills Modal", () => {
  it("renders correctly", () => {
    render(<AddSkills {...mockProps} />);

    // Check for modal title
      expect(screen.getByText(/Add Skill/i)).toBeInTheDocument();
    });


  it("calls setSelectedCategory on category change", () => {
    render(<AddSkills {...mockProps} />);

    const categorySelect = screen.getByLabelText("Select Category") as HTMLSelectElement;
    fireEvent.change(categorySelect, { target: { value: "Frontend" } });

    expect(mockProps.setSelectedCategory).toHaveBeenCalledWith("Frontend");
  });

  it("validates experience input", () => {
    render(<AddSkills {...mockProps} />);
    const input = screen.getByPlaceholderText("Enter years of experience") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "0" } });
    expect(mockProps.setExperience).toHaveBeenCalledWith("0");
    expect(screen.queryByText("Experience must be at least 1 year.")).not.toBeNull();
  });

  it("calls handleSave with correct data when Save is clicked", () => {
    render(
      <AddSkills
        {...mockProps}
        selectedCategory="Frontend"
        selectedSkills={[1, 2]}
        experience="2"
      />
    );

    const saveBtn = screen.getByRole("button", { name: /Save Skill/i });
    fireEvent.click(saveBtn);

    expect(mockProps.handleSave).toHaveBeenCalledWith("Frontend", [1, 2], "2");
  });
});
