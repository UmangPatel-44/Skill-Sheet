import axios from "axios";
import {
  fetchUserSkills,
  fetchSkills,
  fetchCategories,
  fetchSkillsByCategory,
  deleteUserSkill,
  saveUserSkill
} from "../../services/skillService" // Adjust the import path

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("User Skill API utilities", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("fetchUserSkills", () => {
    it("should return transformed skills with levels", async () => {
      mockedAxios.get.mockResolvedValue({
        data: [
          { userSkillId: 1, skillId: 101, skillName: "React", experience: 9, category: "Frontend" }
        ]
      });

      const result = await fetchUserSkills("123", "fakeToken");
      expect(result[0]).toEqual({
        userSkillId: 1,
        skillId: 101,
        name: "React",
        experience: 9,
        category: "Frontend",
        level: "Expert",
        percentage: 90,
        color: "bg-success"
      });
    });

    it("should return empty array on error", async () => {
      mockedAxios.get.mockRejectedValue(new Error("API Error"));
      const result = await fetchUserSkills("123", "fakeToken");
      expect(result).toEqual([]);
    });
  });

  describe("fetchSkills", () => {
    it("should return mapped skills", async () => {
      mockedAxios.get.mockResolvedValue({
        data: [
          { skillId: 1, skillName: "React", category: "Frontend" }
        ]
      });

      const result = await fetchSkills();
      expect(result[0]).toEqual({ skillId: 1, skillName: "React", category: "Frontend" });
    });

    it("should return empty array on error", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Error"));
      const result = await fetchSkills();
      expect(result).toEqual([]);
    });
  });

  describe("fetchCategories", () => {
    it("should return category list on 200", async () => {
      mockedAxios.get.mockResolvedValue({ status: 200, data: ["Frontend", "Backend"] });
      const result = await fetchCategories();
      expect(result).toEqual(["Frontend", "Backend"]);
    });

    it("should return empty array on non-200", async () => {
      mockedAxios.get.mockResolvedValue({ status: 500 });
      const result = await fetchCategories();
      expect(result).toEqual([]);
    });

    it("should handle axios error gracefully", async () => {
      mockedAxios.get.mockRejectedValue({ message: "Network Error" });
      const result = await fetchCategories();
      expect(result).toEqual([]);
    });
  });

  describe("fetchSkillsByCategory", () => {
    it("should return skills by category", async () => {
      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: [{ skillId: 1, skillName: "React" }]
      });

      const result = await fetchSkillsByCategory("Frontend");
      expect(result).toEqual([{ skillId: 1, skillName: "React" }]);
    });

    it("should return empty array if category is invalid", async () => {
      const result = await fetchSkillsByCategory("");
      expect(result).toEqual([]);
    });

    it("should handle error", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Error"));
      const result = await fetchSkillsByCategory("Frontend");
      expect(result).toEqual([]);
    });
  });

  describe("deleteUserSkill", () => {
    it("should delete user skill with valid ID", async () => {
      localStorage.setItem("token", "dummyToken");
      mockedAxios.delete.mockResolvedValue({ status: 200 });

      await expect(deleteUserSkill(1)).resolves.toBeUndefined();
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `https://localhost:7052/api/UserSkill/1`,
        expect.objectContaining({
          headers: { Authorization: `Bearer dummyToken` }
        })
      );
    });

    it("should throw error if userSkillId is null", async () => {
      await expect(deleteUserSkill(null)).rejects.toThrow("User Skill ID cannot be null");
    });

    it("should handle axios error", async () => {
      localStorage.setItem("token", "dummyToken");
      mockedAxios.delete.mockRejectedValue(new Error("Delete error"));
      await expect(deleteUserSkill(5)).rejects.toThrow("Failed to delete user skill. Please try again.");
    });
  });

  describe("saveUserSkill", () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    it("should save skill successfully", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ message: "Skill saved" })
      });

      const result = await saveUserSkill(
        { skillId: 1, skillName: "React", category: "Frontend", experience: 5 },
        "test-token"
      );
      expect(result).toEqual({ message: "Skill saved" });
    });

    it("should throw error if fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValue({ ok: false });
      await expect(
        saveUserSkill({ skillId: 1, skillName: "React", category: "Frontend", experience: 5 }, "token")
      ).rejects.toThrow("Failed to save skill");
    });
  });
});
