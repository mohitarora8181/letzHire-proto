import React, { useState } from "react";
import { X } from "lucide-react";
import { StepIndicator } from "./Stepindicator";
import { SelectInterviewType } from "../interview-steps/SelectInterviewType";
import { NameInterview } from "../interview-steps/NameInterview";
import { InterviewSettings } from "../interview-steps/InterviewSettings";
import { DefinedSkills } from "../interview-steps/DefinedSkills";
import { ReviewInterview } from "../interview-steps/ReviewInterview";
import { InterviewSuccess } from "../interview-steps/InterviewSuccess";

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInterviewModal: React.FC<CreateInterviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    language: "English",
    proctoring: true,
    codingExercise: false,
    skills: [{ name: "React", description: "" }],
    customQuestions: false,
    duration: 7,
  });

  const totalSteps = 6;

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if(currentStep == totalSteps-1){
      console.log(formData);
    }
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleInviteCandidates = () => {
    // Handle inviting candidates
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative">
        {/* Progress bar */}
        <div className="h-2 bg-gray-100">
          <div
            className="h-full bg-green-500 transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Create an interview
          </h2>
          <button
            onClick={() => {
              setCurrentStep(1);
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Step indicator (visible on larger screens) */}
          {currentStep < 6 && (
            <div className="hidden md:block w-60 bg-gray-50 border-r border-gray-200 p-4">
              <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps - 1}
              />
            </div>
          )}

          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentStep === 1 && (
              <SelectInterviewType
                selectedType={formData.type}
                onSelectType={(type) => updateFormData({ type })}
              />
            )}
            {currentStep === 2 && (
              <NameInterview
                name={formData.name}
                onNameChange={(name) => updateFormData({ name })}
              />
            )}
            {currentStep === 3 && (
              <InterviewSettings
                settings={{
                  language: formData.language,
                  proctoring: formData.proctoring,
                  codingExercise: formData.codingExercise,
                }}
                onSettingsChange={(settings) => updateFormData(settings)}
              />
            )}
            {currentStep === 4 && (
              <DefinedSkills
                skills={formData.skills}
                customQuestions={formData.customQuestions}
                onSkillsChange={(skills) => updateFormData({ skills })}
                onCustomQuestionsChange={(customQuestions) =>
                  updateFormData({ customQuestions })
                }
              />
            )}
            {currentStep === 5 && <ReviewInterview formData={formData} />}
            {currentStep === 6 && (
              <InterviewSuccess
                interviewLink="https://www.interview.micro.ai/intro/6fa77f87e-5..."
                onInviteCandidates={handleInviteCandidates}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        {currentStep < 6 && (
          <div className="flex justify-between items-center border-t border-gray-200 px-6 py-4 bg-gray-50">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            <div className="hidden md:flex items-center space-x-2 text-gray-500 text-sm">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>
                Step {currentStep} of {totalSteps - 1}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {currentStep === totalSteps - 1 ? "Create Interview" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
