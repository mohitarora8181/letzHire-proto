import React from "react";
import { MoreVertical } from "lucide-react";
import Badge from "../common/Badge";
import { Link } from "react-router-dom";

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
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:border-gray-200">
      <div className="mb-3 flex justify-between items-start">
        <div className="space-y-2">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>{date}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Owner: {owner}</span>
          </div>
          <h3 className="font-semibold text-xl text-gray-900 leading-tight">
            {title}
          </h3>
        </div>
        <button
          className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-full transition-all duration-200"
          aria-label="More options"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
        <div className="flex items-center gap-1">
          <span className="font-medium">{applicants}</span> Applicants
        </div>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <div className="flex items-center gap-1">
          <span className="font-medium">{vetted}</span> AI vetted
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {jobType.map((type, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded-full border border-gray-100"
          >
            {type}
          </span>
        ))}

        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
          {openings} openings
        </span>

        <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-100">
          {budget}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} color="blue">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <Link
          to={`/jobs/${id}`}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          View details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
