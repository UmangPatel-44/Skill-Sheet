import { renderHook, act } from "@testing-library/react";
import { usePostDetails } from "../../hooks/usePostDetails";
import * as userService from "../../services/userService";

// Mock dependencies
jest.mock("../../services/userService");

const mockNavigate = jest.fn();

const createMockEvent = (id: string, value: string) =>
  ({
    target: {
      id,
      value,
    },
  } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>);

describe("usePostDetails hook", () => {
  const mockUser = { userId: 1, name: "John", email: "john@example.com" };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("userId", "1");
    localStorage.setItem("token", "mock-token");

    (userService.fetchUser as jest.Mock).mockResolvedValue(mockUser);
    (userService.addUserDetails as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  });
  it("updates form data on change", () => {
    const { result } = renderHook(() => usePostDetails(mockNavigate));

    act(() => {
      result.current.handleChange(createMockEvent("gender", "Male"));
    });

    expect(result.current.formData.gender).toBe("Male");
  });

  it("returns validation errors if form is incomplete", async () => {
    const { result } = renderHook(() => usePostDetails(mockNavigate));

    await act(async () => {
      await result.current.handlePost({ preventDefault: () => {} } as React.FormEvent);
    });

    expect(result.current.errors).toHaveProperty("gender");
    expect(result.current.errors).toHaveProperty("birthDate");
    expect(result.current.errors).toHaveProperty("joiningDate");
    expect(result.current.errors).toHaveProperty("qualifications");
  });

  it("does not submit if token is missing", async () => {
    localStorage.removeItem("token");

    const { result } = renderHook(() => usePostDetails(mockNavigate));

    const validData = {
      gender: "Male",
      birthDate: "2000-01-01",
      joiningDate: "2021-01-01",
      qualifications: "B.Tech",
      photoPath: "",
      userId: 1,
      workedInJapan: "true",
    };

    act(() => {
      for (const [id, value] of Object.entries(validData)) {
        result.current.handleChange(createMockEvent(id, String(value)));
      }
    });

    await act(async () => {
      await result.current.handlePost({ preventDefault: () => {} } as React.FormEvent);
    });

    expect(userService.addUserDetails).not.toHaveBeenCalled();
  });
});