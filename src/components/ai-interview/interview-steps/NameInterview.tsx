import React from "react";

interface NameInterviewProps {
  name: string;
  onNameChange: (name: string) => void;
}

export const NameInterview: React.FC<NameInterviewProps> = ({
  name,
  onNameChange,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-gray-800">
          Name the interview you are creating?
        </h3>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. React Developer Interview"
          className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <p className="text-sm text-gray-500">
          The name will be visible to candidates and other members of your
          organization
        </p>
      </div>
    </div>
  );
};
