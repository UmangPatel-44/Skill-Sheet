import React, { useEffect } from "react";
import { useSkills } from "../hooks/useUserSkills";
import { Button } from "react-bootstrap";
import AddSkills from "./Modals/AddSkills";
import SkillDetailModal from "./Modals/SkillDetail";
const Skills: React.FC = () => {
  const {
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
    setShowSkillDetailModal
  } = useSkills();

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  return (
    <div className="card mb-4">
      {/* Card Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Skills</span>
        <Button size="sm" className="float-end" onClick={() => setShowModal(true)}>
          Add Skills +
        </Button>
      </div>

      {/* Card Body */}
      <div
        className="card-body"
        style={{
          maxHeight: "500px", // Fixed height
          overflowY: "auto", // Scrollable vertically
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : userSkills.length > 0 ? (
            userSkills.map((skill, index) => (
              <div key={index} onClick={() => handleSkillClick(skill)} style={{ cursor: "pointer" }}>
              <div className="mb-1 fw-bold">
                {skill.name} -{" "}
                <small className="text-muted fw-light">{skill.level}</small>
              </div>
              <div className="progress mb-3" style={{ height: "4px" }}>
                <div
                  className={`progress-bar ${skill.color}`}
                  style={{ width: `${skill.percentage}%` }}
                  role="progressbar"
                  aria-valuenow={skill.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <p>No skills available</p>
        )}
      </div>

      {/* Removed "SHOW ALL SKILLS" button */}

      {/* Add Skills Modal */}
      <AddSkills
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleAddSkill}
        userSkills={userSkills}
        skills={skills}
        categoryList={categories}
        selectedCategory={selectedCategory || ""}
        setSelectedCategory={setSelectedCategory}
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
      />
      <SkillDetailModal
        show={showSkillDetailModal}
        handleClose={() => setShowSkillDetailModal(false)}
        skill={selectedSkillDetail || { name: "", level: "", experience: 0, category: "", userSkillId: 0 }}
        handleDelete={handleDeleteSkill}
      />
    </div>
  );
};

export default Skills;
