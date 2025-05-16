import React, { useState } from "react";
import { Copy, UserPlus, MoreVertical, Info } from "lucide-react";
import InviteModal from "./modals/InviteModal";

interface Technology {
  name: string;
  color: string;
}

interface Interview {
  id: number;
  title: string;
  technologies: Technology[];
  status: string;
  invited: number;
  taken: number;
  createdOn: string;
  hasOpenJob: boolean;
  codingExercise?: boolean;
  highlighted?: boolean;
}

export const InterviewCard = ({ interview }: { interview: Interview }) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleInvite = () => {
    setIsInviteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
  };

  const handleInviteSuccess = (count: number) => {
    // In a real app, you would update this data from the API
    interview.invited += count;
    setIsInviteModalOpen(false);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/ai-interview/${interview.id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        // Optionally, you can show a toast or alert here:
        alert("Interview link copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy the link.");
      });
  };

  return (
    <>
      <div
        className={`bg-white border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow duration-200 ${
          interview.highlighted ? "border-l-4 border-l-amber-400" : ""
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {interview.title}
              </h3>
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1">
                <MoreVertical size={18} />
              </button>
            </div>

            {interview.highlighted && (
              <div className="flex items-center space-x-1.5 text-amber-600 mb-3">
                <Info size={16} />
                <span className="text-sm">Front-end Developer (React.js)</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {interview.technologies.map((tech, index) => (
            <span
              key={index}
              className={`text-xs px-2.5 py-1 rounded-md font-medium ${tech.color}`}
            >
              {tech.name}
            </span>
          ))}

          {interview.codingExercise && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium flex items-center">
              <span>Coding exercise</span>
              <Info size={14} className="ml-1.5 text-gray-500" />
            </span>
          )}
        </div>

        <div className="flex items-center mb-4">
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
            {interview.status}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Invited: {interview.invited}</span>
            <span>•</span>
            <span>Completed: {interview.taken}</span>
          </div>

          <div className="flex space-x-3">
            <button
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
              onClick={handleCopyLink}
            >
              <Copy size={16} className="mr-1.5" />
              <span>Copy link</span>
            </button>
            <button
              onClick={handleInvite}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
            >
              <UserPlus size={16} className="mr-1.5" />
              <span>Invite</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-sm">
          <span className="text-gray-500">
            Created on {interview.createdOn}
          </span>
          {interview.hasOpenJob && (
            <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium">
              Connect with Job
            </button>
          )}
        </div>
      </div>

      {isInviteModalOpen && (
        <InviteModal
          onClose={handleCloseModal}
          interviewId={interview.id.toString()}
          interviewTitle={interview.title}
          onSuccess={handleInviteSuccess}
        />
      )}
    </>
  );
};

export default InterviewCard;
