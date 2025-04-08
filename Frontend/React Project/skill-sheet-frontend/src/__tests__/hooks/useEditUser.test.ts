import { renderHook, act } from "@testing-library/react";
import useEditUser from "../../hooks/useEditUser";
import * as userService from "../../services/userService";

jest.mock("../../services/userService");

describe("useEditUser", () => {
  const mockUpdateUser = userService.updateUser as jest.Mock;
  const mockOnUserUpdated = jest.fn();
  const mockOnClose = jest.fn();

  const mockUser = {
    userId: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "Password123!",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "mock-token");
  });

  it("should initialize with the given user", () => {
    const { result } = renderHook(() =>
      useEditUser({
        user: mockUser,
        onUserUpdated: mockOnUserUpdated,
        onClose: mockOnClose,
      })
    );

    expect(result.current.updatedUser).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it("should update fields on handleChange", () => {
    const { result } = renderHook(() =>
      useEditUser({
        user: mockUser,
        onUserUpdated: mockOnUserUpdated,
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "Jane Smith" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.updatedUser.name).toBe("Jane Smith");
  });


  it("should call updateUser and onUserUpdated/onClose on success", async () => {
    mockUpdateUser.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() =>
      useEditUser({
        user: mockUser,
        onUserUpdated: mockOnUserUpdated,
        onClose: mockOnClose,
      })
    );

    await act(async () => {
      await result.current.handleUpdate();
    });

    expect(mockUpdateUser).toHaveBeenCalledWith(
      mockUser.email,
      mockUser,
      "mock-token"
    );
    expect(mockOnUserUpdated).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it("should handle updateUser failure", async () => {
    mockUpdateUser.mockRejectedValueOnce(new Error("Update failed"));

    const { result } = renderHook(() =>
      useEditUser({
        user: mockUser,
        onUserUpdated: mockOnUserUpdated,
        onClose: mockOnClose,
      })
    );

    await act(async () => {
      await result.current.handleUpdate();
    });

    expect(result.current.error).toBe("Update failed");
    expect(mockOnUserUpdated).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
