import React from "react";
import { User, Code, Database, MessageSquare, Terminal } from "lucide-react";

interface InterviewType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface SelectInterviewTypeProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

export const SelectInterviewType: React.FC<SelectInterviewTypeProps> = ({
  selectedType,
  onSelectType,
}) => {
  const interviewTypes: InterviewType[] = [
    {
      id: "standard",
      title: "Standard interview",
      description:
        "This is a conversational interview to assess for any role (customer support, sales, marketing, and more)",
      icon: <User className="text-blue-500" size={24} />,
    },
    {
      id: "software-engineer",
      title: "Software engineer full interview",
      description:
        "This is a conversational interview and a coding exercise to test software engineers of all types",
      icon: <Code className="text-blue-500" size={24} />,
    },
    {
      id: "human-data",
      title: "Human data interview",
      description:
        "This is a conversational interview and a data annotation exercise to assess subject-matter experts for human data projects",
      icon: <Database className="text-blue-500" size={24} />,
    },
    {
      id: "custom-questions",
      title: "Custom questions only",
      description:
        "In this interview, you get to add/edit up to 20 custom questions",
      icon: <MessageSquare className="text-blue-500" size={24} />,
    },
    {
      id: "coding-exercise",
      title: "Coding exercise only",
      description: "This is a DSA style coding exercise that is 25 mins",
      icon: <Terminal className="text-blue-500" size={24} />,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-gray-800">
          Select the interview type
        </h3>
      </div>

      <div className="space-y-3">
        {interviewTypes.map((type) => (
          <div
            key={type.id}
            className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/40 ${
              selectedType === type.id
                ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500"
                : "border-gray-200"
            }`}
            onClick={() => onSelectType(type.id)}
          >
            <div className="shrink-0 mr-4 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              {type.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{type.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{type.description}</p>
            </div>
            <div className="ml-4 shrink-0">
              {selectedType === type.id && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
