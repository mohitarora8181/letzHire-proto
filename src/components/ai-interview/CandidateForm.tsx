import React from "react";
import { X } from "lucide-react";

interface Candidate {
  name: string;
  email: string;
  id: string;
}

interface CandidateFormProps {
  candidate: Candidate;
  onChange: (id: string, field: "name" | "email", value: string) => void;
  onRemove: (id: string) => void;
  showRemoveButton: boolean;
  error?: {
    name?: string;
    email?: string;
  };
}

const CandidateForm: React.FC<CandidateFormProps> = ({
  candidate,
  onChange,
  onRemove,
  showRemoveButton,
  error,
}) => {
  return (
    <div className="flex items-start space-x-2 mb-4 relative animate-fadeIn">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Full name"
          value={candidate.name}
          onChange={(e) => onChange(candidate.id, "name", e.target.value)}
          className={`w-full px-3 py-2 border ${
            error?.name ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {error?.name && (
          <p className="text-xs text-red-500 mt-1">{error.name}</p>
        )}
      </div>
      <div className="flex-1">
        <input
          type="email"
          placeholder="Email address"
          value={candidate.email}
          onChange={(e) => onChange(candidate.id, "email", e.target.value)}
          className={`w-full px-3 py-2 border ${
            error?.email ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {error?.email && (
          <p className="text-xs text-red-500 mt-1">{error.email}</p>
        )}
      </div>
      {showRemoveButton && (
        <button
          onClick={() => onRemove(candidate.id)}
          className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200 -mt-1"
          aria-label="Remove candidate"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default CandidateForm;
