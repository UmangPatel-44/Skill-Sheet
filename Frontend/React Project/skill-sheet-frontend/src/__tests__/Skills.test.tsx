import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Skills from "../components/Skills";
import { useSkills } from "../hooks/useUserSkills";

// Mock the custom hook
jest.mock("../hooks/useUserSkills");
const mockedUseSkills = useSkills as jest.MockedFunction<typeof useSkills>;

// Mock modal components
jest.mock("../components/Modals/AddSkills", () => ({
  __esModule: true,
  default: ({ show }: { show: boolean }) => (show ? <div data-testid="add-skills-modal">Add Skills Modal</div> : null),
}));

jest.mock("../components/Modals/SkillDetail", () => ({
  __esModule: true,
  default: ({ show }: { show: boolean }) =>
    show ? <div data-testid="skill-detail-modal">Skill Detail Modal</div> : null,
}));

describe("Skills Component", () => {
    const mockSkill = {
        name: "React",
        level: 2, // ✅ Add this
        color: "bg-success",
        percentage: 60,
        experience: 2,
        category: "Frontend",
        userSkillId: 1,
        skillId: 101,
      };
      

  beforeEach(() => {
    const mockUseSkills = {
        skills: [],
        userSkills: [mockSkill],
        loading: false,
        categories: ["Frontend"],
        selectedCategory: "Frontend",
        setSelectedCategory: jest.fn(),
        selectedSkills: [],
        setSelectedSkills: jest.fn(),
        handleAddSkill: jest.fn(),
        showModal: false,
        setShowModal: jest.fn(),
        handleSkillClick: jest.fn(),
        handleDeleteSkill: jest.fn(),
        showSkillDetailModal: false,
        selectedSkillDetail: mockSkill,
        setShowSkillDetailModal: jest.fn(),
        experience: "",
        setExperience: jest.fn(),
        setSelectedSkillDetail: jest.fn(), // ✅ add this
      };
      
    mockedUseSkills.mockReturnValue(mockUseSkills);
  });

  it("renders without crashing", () => {
    render(<Skills />);
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Add Skills +")).toBeInTheDocument();
  });

  it("displays user skills", () => {
    render(<Skills />);
    expect(screen.getByText("React -")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    mockedUseSkills.mockReturnValueOnce({
      ...mockedUseSkills(),
      loading: true,
      userSkills: [],
    });
    render(<Skills />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows 'No skills available' when userSkills is empty", () => {
    mockedUseSkills.mockReturnValueOnce({
      ...mockedUseSkills(),
      loading: false,
      userSkills: [],
    });
    render(<Skills />);
    expect(screen.getByText("No skills available")).toBeInTheDocument();
  });

  it("opens Add Skills modal on button click", () => {
    const setShowModal = jest.fn();
    mockedUseSkills.mockReturnValueOnce({
      ...mockedUseSkills(),
      setShowModal,
    });

    render(<Skills />);
    fireEvent.click(screen.getByText("Add Skills +"));
    expect(setShowModal).toHaveBeenCalledWith(true);
  });
});
