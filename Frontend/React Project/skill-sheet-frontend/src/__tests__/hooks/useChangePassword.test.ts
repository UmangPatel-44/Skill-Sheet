import { renderHook, act } from "@testing-library/react";
import { useChangePassword } from "../../hooks/useChangePassword";
import * as changePasswordService from "../../services/changePasswordService";

jest.mock("../../services/changePasswordService");

describe("useChangePassword", () => {
  const mockChangeUserPassword = changePasswordService.changeUserPassword as jest.Mock;
  const mockOnClose = jest.fn();
  const userEmail = "test@example.com";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize state correctly", () => {
    const { result } = renderHook(() => useChangePassword(userEmail, mockOnClose));

    expect(result.current.oldPassword).toBe("");
    expect(result.current.newPassword).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.errors).toEqual({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    expect(result.current.isFormValid).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should validate and detect mismatched passwords", () => {
    const { result } = renderHook(() => useChangePassword(userEmail, mockOnClose));

    act(() => {
      result.current.setOldPassword("OldPassword123!");
      result.current.setNewPassword("NewPassword123!");
      result.current.setConfirmPassword("WrongPassword123!");
    });

    expect(result.current.errors.confirmPassword).toBe("Passwords do not match.");
    expect(result.current.isFormValid).toBe(false);
  });

  it("should validate new password strength", () => {
    const { result } = renderHook(() => useChangePassword(userEmail, mockOnClose));

    act(() => {
      result.current.setOldPassword("OldPassword123!");
      result.current.setNewPassword("weak");
      result.current.setConfirmPassword("weak");
    });

    expect(result.current.errors.newPassword).toContain("Password must be at least 8 characters long");
    expect(result.current.isFormValid).toBe(false);
  });

  it("should call changeUserPassword and close modal on success", async () => {
    mockChangeUserPassword.mockResolvedValueOnce(undefined);
    window.alert = jest.fn(); // Mock alert

    const { result } = renderHook(() => useChangePassword(userEmail, mockOnClose));

    act(() => {
      result.current.setOldPassword("OldPassword123!");
      result.current.setNewPassword("NewPassword123!");
      result.current.setConfirmPassword("NewPassword123!");
    });

    await act(async () => {
      await result.current.handlePasswordChange();
    });

    expect(mockChangeUserPassword).toHaveBeenCalledWith(
      userEmail,
      "OldPassword123!",
      "NewPassword123!"
    );
    expect(mockOnClose).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("Password changed successfully!");
  });

  it("should handle errors from changeUserPassword", async () => {
    mockChangeUserPassword.mockRejectedValueOnce(new Error("Server error"));

    const { result } = renderHook(() => useChangePassword(userEmail, mockOnClose));

    act(() => {
      result.current.setOldPassword("OldPassword123!");
      result.current.setNewPassword("NewPassword123!");
      result.current.setConfirmPassword("NewPassword123!");
    });

    await act(async () => {
      await result.current.handlePasswordChange();
    });

    expect(result.current.error).toBe("Server error");
    expect(result.current.loading).toBe(false);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
