import { useEffect, useState } from "react";
import {
  fetchCategories,
  fetchSkillsByCategory,
  fetchUserSkills,
  saveUserSkill,
  deleteUserSkill,
} from "../services/skillService";
import { Skill, UserSkill, SkillDetail } from "../data/types/Skills";
import { Bounce, toast } from "react-toastify";

export const useSkills = () => {
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSkillDetail, setSelectedSkillDetail] = useState<SkillDetail | null>(null);
  const [showSkillDetailModal, setShowSkillDetailModal] = useState(false);
  const [experience, setExperience] = useState<string>("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const showToast = (message: string, type: "success" | "error") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  // Load user skills
  const loadUserSkills = async () => {
    if (!userId || !token) return;
    setLoading(true);
    try {
      const fetchedSkills = await fetchUserSkills(userId, token);
      setUserSkills(fetchedSkills);
    } catch (error) {
      console.error("Failed to fetch user skills", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadUserSkills();
  }, [userId]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await fetchCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadSkills = async () => {
      if (!selectedCategory) {
        setSkills([]);
        return;
      }

      try {
        const skillList = await fetchSkillsByCategory(selectedCategory);

        // Filter out skills that the user already has
        const filteredSkills = skillList.filter(
          (skill) => !userSkills.some((userSkill) => userSkill.skillId === skill.skillId)
        );

        setSkills(filteredSkills);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      }
    };

    loadSkills();
  }, [selectedCategory, userSkills,selectedSkills]); // Runs when category or userSkills change

  // Handle adding skills
  const handleAddSkill = async (selectedCategory: string, selectedSkills: number[], experience: string) => {
    if (!userId || !token) {
      console.error("User not authenticated");
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];

    // Check for duplicate skills before adding
    const duplicateSkills = selectedSkills.filter((skillId) =>
      userSkills.some((userSkill) => userSkill.skillId === skillId)
    );

    if (duplicateSkills.length > 0) {
      showToast("Some skills are already added!", "error");
      return;
    }

    try {
      await Promise.all(
        selectedSkills.map(async (skillId) => {
          const skill = skills.find((s) => s.skillId === skillId);
          if (!skill) return;

          const payload = {
            userId: Number(userId),
            skillId,
            skillName: skill.skillName,
            category: selectedCategory,
            experience: Number(experience),
            dateAdded: currentDate,
          };

          return saveUserSkill(payload, token);
        })
      );

      showToast("User Skill Added Successfully", "success");

      await loadUserSkills();
      setShowModal(false);
      setSelectedSkills([]); // Reset selected skills
    } catch (error) {
      console.error("Failed to save skills", error);
      showToast("Failed to Save Skill", "error");
    }
  };

  // Handle skill click (to view details)
  const handleSkillClick = (skill: SkillDetail): void => {
    setSelectedSkillDetail(skill);
    setShowSkillDetailModal(true);
  };

  // Handle skill deletion
  const handleDeleteSkill = async (userSkillId: number): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteUserSkill(userSkillId);
        await loadUserSkills();
        setShowSkillDetailModal(false);
      } catch (error) {
        console.error("Failed to delete skill", error);
      }
    }
  };

  return {
    skills,
    userSkills,
    loading,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedSkills,
    setSelectedSkills,
    handleAddSkill,
    showModal,
    setShowModal,
    handleSkillClick,
    handleDeleteSkill,
    showSkillDetailModal,
    selectedSkillDetail,
    setSelectedSkillDetail,
    setShowSkillDetailModal,
    experience,
    setExperience,
  };
};
