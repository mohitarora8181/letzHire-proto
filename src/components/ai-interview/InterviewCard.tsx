import React from 'react';
import { CalendarDays, Clock, Users, Code, Globe, Tag, ChevronRight, UserCheck } from 'lucide-react';

interface Technology {
  name: string;
  color: string;
}

interface Interview {
  id: string;
  title: string;
  createdOn: string;
  duration: number;
  language: string;
  proctoring: boolean;
  codingExercise: boolean;
  customQuestions: boolean;
  technologies: Technology[];
  invited: number;
  taken: number;
  students?: string[];
}

interface InterviewCardProps {
  interview: Interview;
  onViewStudents: () => void;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({ interview, onViewStudents }) => {
  const progress = interview.invited > 0 ? Math.round((interview.taken / interview.invited) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight">
            {interview.title}
          </h3>
          <div className="flex gap-1">
            {interview.proctoring && (
              <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                Proctored
              </span>
            )}
            {interview.codingExercise && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Coding
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <CalendarDays size={16} className="mr-1" />
          Created on {new Date(interview.createdOn).toLocaleDateString()}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={14} className="mr-1.5" />
            {interview.duration} min
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Globe size={14} className="mr-1.5" />
            {interview.language}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users size={14} className="mr-1.5" />
            {interview.invited} invited
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <UserCheck size={14} className="mr-1.5" />
            {interview.taken} taken
          </div>
        </div>

        {/* Skills tags */}
        <div className="mb-4">
          <div className="flex items-center text-xs text-gray-500 mb-1.5">
            <Tag size={14} className="mr-1" />
            Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {interview.technologies.slice(0, 5).map((tech, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-0.5 rounded-full ${tech.color || 'bg-blue-100 text-blue-800'}`}
              >
                {tech.name}
              </span>
            ))}
            {interview.technologies.length > 5 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                +{interview.technologies.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card footer with buttons */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewStudents();
          }}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
        >
          View Students ({interview.students?.length || 0})
        </button>

        <button className="text-gray-700 text-sm font-medium hover:text-gray-900 flex items-center">
          Interview Details
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default InterviewCard;
