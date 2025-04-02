import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select';
import { SkillModalProps } from "../../data/types/Skills";

const AddSkills: React.FC<SkillModalProps> = ({ 
  show, handleClose, handleSave, skills, categoryList, 
  selectedCategory, setSelectedCategory, selectedSkills, setSelectedSkills ,experience,setExperience
}) => {
  
  
  const [error, setError] = useState<string>("");

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();  
    const numberValue = Number(value);

    if (isNaN(numberValue) || numberValue < 1) {
      setError("Experience must be at least 1 year.");
      setExperience(value); 
    } else {
      setError("");
      setExperience(value);
    }
  };

  return (
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
              {categoryList.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Dropdown */}
          <div className="mb-3">
            <label className="form-label">Select Skill</label>
            <Select
              options={skills.map((skill) => ({
                value: skill.skillId,
                label: skill.skillName,
              }))}
              isMulti
              onChange={(selected) => setSelectedSkills(selected.map((s) => s.value))}
              value={skills
                .filter((s) => selectedSkills.includes(s.skillId))
                .map((s) => ({ value: s.skillId, label: s.skillName }))}
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
              onChange={handleExperienceChange}
              placeholder="Enter years of experience"
              min="1"
            />
            {error && <div className="text-danger mt-1">{error}</div>}
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={() => handleSave(selectedCategory, selectedSkills, experience)}
          disabled={!!error || experience === ""}
        >
          Save Skill  
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSkills;
