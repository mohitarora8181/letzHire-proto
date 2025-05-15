import React from "react";
import { CheckCircle, Clock } from "lucide-react";

interface ReviewInterviewProps {
  formData: {
    type: string;
    name: string;
    language: string;
    proctoring: boolean;
    codingExercise: boolean;
    skills: Array<{ name: string; description: string }>;
    customQuestions: boolean;
    duration: number;
  };
}

export const ReviewInterview: React.FC<ReviewInterviewProps> = ({
  formData,
}) => {
  // Map interview type ID to display name
  const interviewTypeMap: Record<string, string> = {
    standard: "Standard interview",
    "software-engineer": "Software engineer full interview",
    "human-data": "Human data interview",
    "custom-questions": "Custom questions only",
    "coding-exercise": "Coding exercise only",
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-gray-800">
          Review the defined interview
        </h3>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        {/* Summary section */}
        <div className="bg-white p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {formData.name || "Unnamed Interview"}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-1" />
              <span>Interview duration: {formData.duration} minutes</span>
            </div>
          </div>

          {/* Skills section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </div>

          {/* Interview settings */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Interview setting
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="flex items-center mr-3">
                  <img
                    src="https://flagcdn.com/w20/us.png"
                    alt="English"
                    className="w-4 h-3 mr-2"
                  />
                  <span className="text-sm text-gray-600">English</span>
                </div>
              </div>
              <div className="flex items-center">
                {formData.codingExercise ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle size={16} className="text-red-500 mr-2" />
                    <span>Coding exercise</span>
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>No coding exercise</span>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {formData.proctoring ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    <span>Proctoring</span>
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>No proctoring</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success banner */}
        <div className="bg-green-50 border-t border-green-100 p-4 flex items-center">
          <CheckCircle size={20} className="text-green-500 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-green-800">
              Ready to create
            </h4>
            <p className="text-xs text-green-700 mt-0.5">
              Your interview is configured and ready to be created. Review the
              details above and click "Create Interview" to proceed.
            </p>
          </div>
        </div>
      </div>

      {/* Interview type info */}
      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Interview type
        </h4>
        <p className="text-sm text-gray-600">
          {interviewTypeMap[formData.type] || "Standard interview"}
        </p>
      </div>
    </div>
  );
};
