import React from 'react';
import { MoreVertical } from 'lucide-react';
import Badge from '../common/Badge';
import { Link } from 'react-router-dom';

interface JobCardProps {
  id: string;
  title: string;
  date: string;
  owner: string;
  applicants: number;
  vetted: number;
  jobType: string[];
  budget: string;
  skills: string[];
  openings: number;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  date,
  owner,
  applicants,
  vetted,
  jobType,
  budget,
  skills,
  openings,
}) => {
  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="mb-2 flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">{date} · Owner: {owner}</div>
          <h3 className="font-semibold text-lg mt-1">{title}</h3>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreVertical size={20} />
        </button>
      </div>
      
      <div className="text-sm text-gray-600 mt-1">
        Applicants: {applicants} · AI vetted: {vetted}
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {jobType.map((type, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
            {type}
          </span>
        ))}
        
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
          {openings} openings
        </span>
        
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
          {budget} budget
        </span>
        
        {skills.map((skill, index) => (
          <Badge key={index} color="blue">
            {skill}
          </Badge>
        ))}
      </div>
      
      <div className="mt-4 flex justify-end">
        <Link 
          to={`/jobs/${id}`}
          className="btn btn-secondary"
        >
          View details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;