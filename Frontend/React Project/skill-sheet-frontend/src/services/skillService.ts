import axios from "axios";

interface SkillData {
  skillId: number;
  skillName: string;
  experience: number;
  category: string;
}

export const fetchUserSkills = async (userId: string | null, token:string|null) => {
  if (!userId) return [];

  try {
    
    const response = await axios.get(`https://localhost:7052/api/UserSkill/${userId}`,{
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map((skill: { userSkillId:number;skillId:number; skillName: string; experience: number;category:string }) => ({
      userSkillId: skill.userSkillId,
      skillId:skill.skillId,
      name: skill.skillName,
      experience:skill.experience,
      category:skill.category,

      level: getLevel(skill.experience),
      percentage: getPercentage(skill.experience),  // Convert experience into percentage
      color: getColor(skill.experience), // Assign color dynamically
    }));
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
};
const getPercentage = (experience: number) => {
  return experience * 10 > 100 ? 100 : experience * 10;
}
  
const getLevel = (experience: number) => {
  if (experience >= 9) return "Expert";
  if (experience >= 7) return "Advanced";
  if (experience >= 5) return "Intermediate";
  return "Beginner";
}
// Function to assign colors based on experience level
const getColor = (experience: number) => {
  if (experience >= 9) return "bg-success";
  if (experience >= 7) return "bg-warning";
  if (experience >= 5) return "bg-danger";
  return "bg-secondary";
};

export const fetchSkills= async()=>
{
  try{
    const response= await axios.get(`https://localhost:7052/api/Skill`);
    return response.data.map((skillList:{skillId:number;skillName:string,category:string})=>({
      skillId:skillList.skillId,
      skillName:skillList.skillName,
      category:skillList.category,
  }));
  }
  catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }

};

export const fetchCategories = async()=>
{
  try
  {
    const response=await axios.get(`https://localhost:7052/api/Skill/categories`);
    if (response.status===200)
    {
      return response.data;
    }
    else {
      console.error("Unexpected response status:", response.status);
      return [];
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching skills by category:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected error fetching skills by category:", error);
    }
    return [];
  }
};
export const fetchSkillsByCategory = async (category: string) => {
  // Validate the category parameter
  if (!category || typeof category !== "string") {
    console.error("Invalid or missing category parameter");
    return [];
  }

  try {
    console.log("Category:", category);
    const response = await axios.get(`https://localhost:7052/api/Skill/category?category=${category}`);
    
    if (response.status === 200) {
      // Adjust the mapping based on the actual response structure
      return response.data.map((skill: { skillId: number; skillName: string }) => ({
        skillId: skill.skillId,
        skillName: skill.skillName,
      }));
    } else {
      console.error("Unexpected response status:", response.status);
      return [];
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching skills by category:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected error fetching skills by category:", error);
    }
    return [];
  }
}; 
export const deleteUserSkill = async (userSkillId: number | null) => {
  try {
    const token = localStorage.getItem("token");

    if (!userSkillId) {
      throw new Error("User Skill ID cannot be null");
    }

    await axios.delete(`https://localhost:7052/api/UserSkill/${userSkillId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error while deleting user skill:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else if (
      error instanceof Error &&
      error.message === "User Skill ID cannot be null"
    ) {
      // Re-throw the same error so test can catch it
      throw error;
    } else {
      console.error("Unexpected error:", error);
    }
  
    throw new Error("Failed to delete user skill. Please try again.");
  }
  
};

export const saveUserSkill = async (skillData: SkillData, token: string) => {
  try {
    const response = await fetch(`https://localhost:7052/api/UserSkill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(skillData)
    });

    if (!response.ok) {
      throw new Error("Failed to save skill");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving user skill:", error);
    throw error;
  }
};
