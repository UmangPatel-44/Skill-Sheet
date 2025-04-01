import { useEffect, useState } from "react";
import { fetchCategories, fetchSkillsByCategory, fetchUserSkills,saveUserSkill } from "../services/skillService";
import { deleteUserSkill } from "../services/skillService";
import { Skill,UserSkill,SkillDetail } from "../data/types/Skills";
export const useSkills = () => {
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSkillDetail, setSelectedSkillDetail] = useState<SkillDetail | null>(null);
  const [showSkillDetailModal, setShowSkillDetailModal] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Extract loadUserSkills to be reusable
  const loadUserSkills = async () => {
    if (!userId || !token) return;

    setLoading(true);
    const fetchedSkills = await fetchUserSkills(userId, token);
    setUserSkills(fetchedSkills);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) loadUserSkills();
  }, []);

  useEffect(() => {
    const loadSkills = async () => {
      const categoryList = await fetchCategories();
      setCategories(categoryList);
    };
    loadSkills();
  }, []);

  useEffect(() => {
    const loadSkills = async () => {
      if (selectedCategory) {
        const skillList = await fetchSkillsByCategory(selectedCategory);
        setSkills(skillList);
      } else {
        setSkills([]);
      }
    };
    loadSkills();
  }, [selectedCategory]);

  const handleAddSkill = async (selectedCategory: string, selectedSkills: number[], experience: string) => {
    if (!userId || !token) {
      console.error("User not authenticated");
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    try {
      for (const skillId of selectedSkills) {
        const skill = skills.find((s) => s.skillId === skillId); // get skillName
        if (!skill) continue;

        const payload = {
          userId: Number(userId),
          skillId: skillId,
          skillName: skill.skillName,
          category: selectedCategory,
          experience: Number(experience),
          dateAdded: currentDate,
        };
        console.log(payload);
        await saveUserSkill(payload, token); // API call
        console.log(`Saved skill: ${skill.skillName}`);
      }
      await loadUserSkills();

      setShowModal(false); 
    } catch (error) {
      console.error("Failed to save skills", error);
    }
  };
  

  const handleSkillClick = (skill: SkillDetail): void => {
    setSelectedSkillDetail(skill);
    setShowSkillDetailModal(true);
  };
  
  const handleDeleteSkill = async (userSkillId: number): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteUserSkill(userSkillId); // Pass userSkillId
        await loadUserSkills(); // Refresh skills list after deletion
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
    setShowSkillDetailModal
  };
};
