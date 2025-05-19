import React from "react";
import {
  CalendarDays,
  Clock,
  Users,
  Code,
  Globe,
  Tag,
  ChevronRight,
  UserCheck,
} from "lucide-react";

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
  animationDelay?: number;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onViewStudents,
  animationDelay = 0,
}) => {
  const progress =
    interview.invited > 0
      ? Math.round((interview.taken / interview.invited) * 100)
      : 0;

  const animationStyle = {
    animationDelay: `${animationDelay}ms`,
  };

  return (
    <div
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 animate-slideUp hover:border-blue-200"
      style={animationStyle}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200">
            {interview.title}
          </h3>
          <div className="flex gap-1.5">
            {interview.proctoring && (
              <span className="bg-indigo-50 text-indigo-600 text-xs px-2.5 py-1 rounded-full font-medium transition-transform duration-200 hover:scale-105">
                Proctored
              </span>
            )}
            {interview.codingExercise && (
              <span className="bg-green-50 text-green-600 text-xs px-2.5 py-1 rounded-full font-medium transition-transform duration-200 hover:scale-105">
                Coding
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-5">
          <CalendarDays size={16} className="mr-1.5 text-gray-400" />
          Created on {new Date(interview.createdOn).toLocaleDateString()}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg transition-colors duration-200 hover:bg-gray-100">
            <Clock size={15} className="mr-2 text-gray-400" />
            {interview.duration} min
          </div>
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg transition-colors duration-200 hover:bg-gray-100">
            <Globe size={15} className="mr-2 text-gray-400" />
            {interview.language}
          </div>
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg transition-colors duration-200 hover:bg-gray-100">
            <Users size={15} className="mr-2 text-gray-400" />
            {interview.invited} invited
          </div>
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg transition-colors duration-200 hover:bg-gray-100">
            <UserCheck size={15} className="mr-2 text-gray-400" />
            {interview.taken} taken
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Tag size={14} className="mr-1.5 text-gray-400" />
            Skills
          </div>
          <div className="flex flex-wrap gap-2">
            {interview.technologies.slice(0, 5).map((tech, i) => (
              <span
                key={i}
                className={`text-xs px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 ${
                  tech.color || "bg-blue-50 text-blue-600"
                } font-medium`}
              >
                {tech.name}
              </span>
            ))}
            {interview.technologies.length > 5 && (
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 hover:scale-105 font-medium">
                +{interview.technologies.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center group-hover:bg-gray-100 transition-colors duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewStudents();
          }}
          className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center transition-all duration-200 hover:translate-x-0.5"
        >
          View Students ({interview.students?.length || 0})
        </button>

        <button className="text-gray-700 text-sm font-medium hover:text-gray-900 flex items-center transition-all duration-200 hover:translate-x-0.5">
          Interview Details
          <ChevronRight
            size={16}
            className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </div>
  );
};

export default InterviewCard;
