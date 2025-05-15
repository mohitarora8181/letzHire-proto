import React from 'react';
import { MoreVertical, Calendar, Users } from 'lucide-react';

interface InterviewCardProps {
  title: string;
  description: string;
  date: string;
  candidates: number;
  skills: string[];
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  title,
  description,
  date,
  candidates,
  skills,
}) => {
  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{title}</h3>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreVertical size={20} />
        </button>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
      
      <div className="mt-3 flex flex-wrap gap-1">
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{date}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>{candidates} candidates</span>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;