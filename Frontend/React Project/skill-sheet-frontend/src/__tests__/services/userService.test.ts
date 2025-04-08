import axios from "axios";
import {
  fetchUser,
  fetchUserDetails,
  updateUserDetails,
  addUser,
  getProfilePhoto,
  uploadProfilePhoto,
  updateUser,
  addUserDetails,
} from "../../services/userService";
import { UserDetailApiResponse } from "../../data/types/UserTypes";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("User API", () => {
  beforeEach(() => {
    localStorage.setItem("token", "mock-token");
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchUserDetails", () => {
    it("should fetch user details successfully", async () => {
      const mockData = { name: "John", gender: "Male" };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchUserDetails();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it("should throw error on failure", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("API failed"));
      await expect(fetchUserDetails()).rejects.toThrow();
    });
  });

  describe("fetchUser", () => {
    it("should fetch user profile successfully", async () => {
      const mockUser = { email: "john@example.com" };
      mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await fetchUser();
      expect(result).toEqual(mockUser);
    });

    it("should throw error on API failure", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Fail"));
      await expect(fetchUser()).rejects.toThrow();
    });
  });

  describe("updateUserDetails", () => {
    it("should send PUT request with correct headers and body", async () => {
        const user: UserDetailApiResponse = {
          userId: 1,
          gender: "Female", // now correctly inferred as literal
          birthDate: "1990-01-01",
          joiningDate: "2020-01-01",
          qualifications: "MBA",
          workedInJapan: true,
          photoPath: "/images/profile.jpg"
        };
      
        mockedAxios.put.mockResolvedValueOnce({});
      
        await updateUserDetails(user);
      
        expect(mockedAxios.put).toHaveBeenCalledWith(
          "https://localhost:7052/api/userdetails/me",
          user,
          expect.objectContaining({
            headers: expect.any(Object),
          })
        );
      });
      
      
  });

  describe("addUser", () => {
    it("should add user successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => true,
      });

      const result = await addUser("John", "john@example.com", "123", "mock-token");
      expect(result).toBe(true);
    });

    it("should throw error if fetch fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
      await expect(addUser("John", "john@example.com", "123", "mock-token")).rejects.toThrow("Failed to add user");
    });
  });

  describe("getProfilePhoto", () => {
    it("should return photo URL if successful", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { photoUrl: "photo.jpg" } });

      const url = await getProfilePhoto();
      expect(url).toBe("photo.jpg");
    });

    it("should throw error if token is missing", async () => {
      localStorage.removeItem("token");
      await expect(getProfilePhoto()).rejects.toThrow("No authentication token found.");
    });

    it("should throw error if axios fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Fail"));
      await expect(getProfilePhoto()).rejects.toThrow();
    });
  });

  describe("uploadProfilePhoto", () => {
    it("should upload file and return data", async () => {
      const mockFile = new File(["photo"], "photo.png", { type: "image/png" });
      mockedAxios.post.mockResolvedValueOnce({ data: "uploaded" });

      const result = await uploadProfilePhoto(mockFile);
      expect(result).toBe("uploaded");
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      const success = await updateUser("john@example.com", { name: "New", email: "john@example.com", password: "123" }, "mock-token");
      expect(success).toBe(true);
    });

    it("should throw error if update fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(
        updateUser("john@example.com", { name: "New", email: "john@example.com", password: "123" }, "mock-token")
      ).rejects.toThrow("Failed to update user details");
    });
  });

  describe("addUserDetails", () => {
    it("should add user details successfully", async () => {
      const mockResponse = { id: 1, gender: "Male" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await addUserDetails({ gender: "Male" }, "mock-token");
      expect(result).toEqual(mockResponse);
    });

    it("should throw error if response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(addUserDetails({ gender: "Male" }, "mock-token")).rejects.toThrow("Failed to add user details.");
    });
  });
});
