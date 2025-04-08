import { renderHook, act, waitFor } from "@testing-library/react";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import * as adminService from "../../services/adminService";
import { TestApiUserResponse } from "../../data/types/ApiUserResponse";

// Mock the localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value.toString()),
    clear: () => (store = {}),
    removeItem: (key: string) => delete store[key],
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock users
const mockUsers: TestApiUserResponse[] = [
  {userId:90, name: "Alice", email: "alice@example.com", role: "Admin",password: "password123"},
  { userId: 91,name: "Bob", email: "bob@example.com", role: "User",password: "password123"},
  {userId:92, name: "Charlie", email: "charlie@example.com", role: "User",password: "password123" },
];

jest.mock("../../services/adminService");

describe("useAdminDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "mock-token");
  });

  it("fetches users on mount", async () => {
    (adminService.getUsers as jest.Mock).mockResolvedValueOnce(mockUsers);

    const { result } = renderHook(() => useAdminDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false)); // Wait for useEffect to complete

    expect(result.current.users.length).toBe(3);
    expect(result.current.sortedUsers[0].name).toBe("Alice");
    expect(result.current.loading).toBe(false);
  });

  it("handles user search", async () => {
    (adminService.getUsers as jest.Mock).mockResolvedValueOnce(mockUsers);

    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearchTerm("bob");
    });

    expect(result.current.sortedUsers).toHaveLength(1);
    expect(result.current.sortedUsers[0].name).toBe("Bob");
  });

  it("handles sorting", async () => {
    (adminService.getUsers as jest.Mock).mockResolvedValueOnce(mockUsers);

    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleSort("name");
    });

    expect(result.current.sortedUsers[0].name).toBe("Charlie"); // sorted asc
    act(() => {
      result.current.handleSort("name");
    });
    expect(result.current.sortedUsers[0].name).toBe("Alice"); // sorted desc
  });

  it("handles pagination logic", async () => {
    (adminService.getUsers as jest.Mock).mockResolvedValueOnce(mockUsers);

    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.currentUsers.length).toBeLessThanOrEqual(7); // 7 per page
    expect(result.current.totalPages).toBe(1);
  });

  it("deletes a user", async () => {
    (adminService.getUsers as jest.Mock).mockResolvedValueOnce(mockUsers);
    (adminService.deleteUser as jest.Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSelectedUser(mockUsers[0]);
    });

    await act(async () => {
      await result.current.handleDeleteUser();
    });

    expect(adminService.deleteUser).toHaveBeenCalledWith(mockUsers[0].email, "mock-token");
    expect(result.current.users.find((u) => u.email === mockUsers[0].email)).toBeUndefined();
  });

  it("handles missing token error", async () => {
    localStorage.removeItem("token");
    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Failed to fetch users.");
  });
});


