import React, { useState } from "react";
import { Info, Plus, X } from "lucide-react";

interface Skill {
  name: string;
  description: string;
}

interface DefinedSkillsProps {
  skills: Skill[];
  customQuestions: boolean;
  onSkillsChange: (skills: Skill[]) => void;
  onCustomQuestionsChange: (customQuestions: boolean) => void;
}

export const DefinedSkills: React.FC<DefinedSkillsProps> = ({
  skills,
  customQuestions,
  onSkillsChange,
  onCustomQuestionsChange,
}) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && skills.length < 5) {
      onSkillsChange([...skills, { name: newSkill.trim(), description: "" }]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    onSkillsChange(updatedSkills);
  };

  const updateSkillDescription = (index: number, description: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], description };
    onSkillsChange(updatedSkills);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-gray-800">Defined skills</h3>
        <p className="text-sm text-gray-600">
          Define the skills you want to test candidates on. It can be any skill
          from sales negotiation to react.js and beyond. The optional
          description can be used to refine the questions or avoid certain areas
          within the skill.
        </p>
      </div>

      <div className="space-y-5">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Code size={16} className="text-blue-600" />
                </div>
                <span className="font-medium text-gray-800">{skill.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <textarea
              value={skill.description}
              onChange={(e) => updateSkillDescription(index, e.target.value)}
              placeholder="Feel free to describe the skill in 1-2 sentences to further tailor the questions (optional)"
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              rows={2}
            />
          </div>
        ))}

        {skills.length < 5 && (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add another skill"
                className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSkill}
                disabled={!newSkill.trim() || skills.length >= 5}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              + Add another skill (up to 4 more)
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="customQuestions"
            checked={customQuestions}
            onChange={() => onCustomQuestionsChange(!customQuestions)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
          />
          <div className="flex items-center">
            <label
              htmlFor="customQuestions"
              className="text-sm font-medium text-gray-700"
            >
              Add custom questions
            </label>
            <button
              type="button"
              className="ml-1.5 text-gray-400 hover:text-gray-500"
            >
              <Info size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 relative top-0.5">
            <svg
              className="text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="ml-3 text-sm text-blue-700">
            You can view example questions that will be asked for each skill.
            This gives you a preview of the interview experience.
          </p>
        </div>
      </div>
    </div>
  );
};

const Code: React.FC<{ size: number; className: string }> = ({
  size,
  className,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
};
