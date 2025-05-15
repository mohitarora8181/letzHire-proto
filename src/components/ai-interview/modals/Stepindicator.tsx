import React from "react";
import { Check, Clock, User, Settings, Code, FileText } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

interface Step {
  title: string;
  icon: React.ReactNode;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  //   totalSteps,
}) => {
  const steps: Step[] = [
    { title: "Select interview type", icon: <User size={18} /> },
    { title: "Name interview", icon: <FileText size={18} /> },
    { title: "Interview settings", icon: <Settings size={18} /> },
    { title: "Define skills", icon: <Code size={18} /> },
    { title: "Review", icon: <Clock size={18} /> },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Progress</h3>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors duration-300 ${
              index + 1 < currentStep
                ? "bg-green-100 text-green-600"
                : index + 1 === currentStep
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {index + 1 < currentStep ? <Check size={16} /> : step.icon}
          </div>
          <span
            className={`text-sm ${
              index + 1 === currentStep
                ? "font-medium text-blue-600"
                : index + 1 < currentStep
                ? "font-medium text-gray-700"
                : "text-gray-500"
            }`}
          >
            {step.title}
          </span>
        </div>
      ))}
    </div>
  );
};
