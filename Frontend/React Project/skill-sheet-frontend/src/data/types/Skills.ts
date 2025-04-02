export interface UserSkill {
  userSkillId:number;
  skillId:number;
  name: string;
  experience:number;
  category:string;
  level: number;
  percentage: number;
  color: string;
}
export interface Skill
{
  skillId:number;
  skillName:string;
}
export interface SkillDetail {
  userSkillId: number;
  skillId: number;
  name: string;
  experience: number;
  category: string;
  level: number;
  percentage: number;
  color: string;
}
  
export interface SkillModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (categories: string ,skill: number[], experience: string) => void;
  userSkills: UserSkill[];
  skills:Skill[];
  categoryList:string[];
  selectedCategory:string;
  setSelectedCategory: (category: string) => void
  selectedSkills:number[];
  setSelectedSkills:(skills:number[])=>void
  experience:string;
  setExperience:(experience: string )=> void
}
