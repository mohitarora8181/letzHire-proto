import React from "react";
import { Info } from "lucide-react";

interface InterviewSettingsProps {
  settings: {
    language: string;
    proctoring: boolean;
    codingExercise: boolean;
  };
  onSettingsChange: (
    settings: Partial<InterviewSettingsProps["settings"]>
  ) => void;
}

export const InterviewSettings: React.FC<InterviewSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-gray-800">
          Interview settings
        </h3>
      </div>

      {/* Language Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700"
          >
            Define interview language
          </label>
        </div>
        <div className="relative">
          <div className="inline-flex items-center px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg">
            <img
              src="https://flagcdn.com/w20/us.png"
              alt="USA"
              className="w-5 h-3.5 mr-2"
            />
            <span className="text-gray-800">English</span>
            <svg
              className="w-5 h-5 ml-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Proctoring Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">
              Proctoring
            </span>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              title="Learn more about proctoring"
            >
              <Info size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.proctoring}
              onChange={() =>
                onSettingsChange({ proctoring: !settings.proctoring })
              }
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <p className="text-sm text-gray-500">
          Proctoring allows you to verify candidate identity and monitor screen
          sharing during the interview.
        </p>
      </div>

      {/* Coding Exercise Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">
              Coding exercise
            </span>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              title="Learn more about coding exercises"
            >
              <Info size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.codingExercise}
              onChange={() =>
                onSettingsChange({ codingExercise: !settings.codingExercise })
              }
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <p className="text-sm text-gray-500">
          Include a coding exercise that candidates need to complete during the
          interview.
        </p>
      </div>

      {/* Duration Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex">
        <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-800">
            Interview duration: 7 minutes
          </h4>
          <p className="text-sm text-blue-600 mt-1">
            This is an estimate based on your current settings and may vary
            depending on the candidate.
          </p>
        </div>
      </div>
    </div>
  );
};
