
import React from "react";
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select';
import { Skill,SkillModalProps,UserSkill } from "../../data/types/Skills";

const AddSkills: React.FC<SkillModalProps> = ({ show, handleClose, handleSave,skills,categoryList,selectedCategory,setSelectedCategory,selectedSkills,setSelectedSkills }) => {
  const [experience, setExperience] = React.useState<string>("");
  
  
  return (
    <div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {/* Category Dropdown */}
            <div className="mb-3">
              <label className="form-label">Select Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Choose a Category...</option>
                {categoryList.map((categories) => (
                  <option value={categories} key={categories}>
                    {categories}
                  </option>
                ))}
              </select>
            </div>
            {/* Skill Dropdown */}
            
            <div className="mb-3">
              <label className="form-label">Select Skill</label>
              <Select
                isMulti
                options={skills.map(skill => ({
                  value: skill.skillId,
                  label: skill.skillName
                }))}
                value={skills
                  .filter(skill => selectedSkills.includes(skill.skillId))
                  .map(skill => ({
                    value: skill.skillId,
                    label: skill.skillName
                  }))}
                onChange={(selectedOptions: { value: number; label: string }[]) => {
                  const selectedValues = selectedOptions.map(option => option.value);
                  setSelectedSkills(selectedValues);
                }}
                placeholder="Select skills..."
              />
            </div>
            {/* Experience Input */}
            <div className="mb-3">
              <label className="form-label">Experience (years)</label>
              <input
                type="number"
                className="form-control"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Enter years of experience"
              />
            </div>
          </form>
        </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleSave(selectedCategory,selectedSkills, experience)} >
              Save Skill  
              
            </Button>
          </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddSkills;
