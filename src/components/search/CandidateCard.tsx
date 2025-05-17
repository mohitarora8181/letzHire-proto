import React from 'react';
import { MoreVertical, BookOpen, Calendar, Check } from 'lucide-react';
import Badge from '../common/Badge';
import { Link } from 'react-router-dom';

interface CandidateProps {
  id: string;
  name: string;
  position: string;
  experience: number;
  country: string;
  countryFlag: string;
  skills: string[];
  salary: string;
  hourlyRate: string;
  verified: boolean;
  description: string;
  photo: string;
  interviews?: Array<{
    callId: string;
    completedOn: string;
    interviewId: string;
    status: string;
    title: string;
  }>;
  email?: string;
}

const CandidateCard: React.FC<CandidateProps> = ({
  id,
  name,
  position,
  experience,
  country,
  countryFlag,
  skills,
  salary,
  hourlyRate,
  verified,
  description,
  photo,
  interviews = [],
  email,
}) => {
  // Calculate how many days since the most recent interview
  const getLastInterviewDays = () => {
    if (!interviews || interviews.length === 0) return null;

    // Find the most recent interview
    const sortedInterviews = [...interviews].sort((a, b) =>
      new Date(b.completedOn).getTime() - new Date(a.completedOn).getTime()
    );

    const mostRecent = sortedInterviews[0];
    const completedDate = new Date(mostRecent.completedOn);
    const today = new Date();

    // Calculate days difference
    const diffTime = Math.abs(today.getTime() - completedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      days: diffDays,
      title: mostRecent.title
    };
  };

  const lastInterview = getLastInterviewDays();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Profile Image */}
        <img
          src={photo || "https://via.placeholder.com/150?text=" + name.charAt(0)}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
        />

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{name}</h3>
              {verified && (
                <span className="text-green-500 flex items-center" title="Verified Student">
                  <Check className="w-4 h-4" />
                </span>
              )}
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Student info line */}
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">{position || "Student"}</span>
            {experience > 0 && <span> · {experience} years experience</span>}
            {country && country !== "Unknown" && <span> · {country} {countryFlag}</span>}
            {email && <div className="text-gray-500 text-xs mt-1">{email}</div>}
          </div>

          {/* Skills section */}
          {skills && skills.length > 0 && (
            <div className="mt-3">
              <div className="text-xs uppercase text-gray-500 mb-1">Skills</div>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, index) => (
                  <Badge key={index} color={index % 5 === 0 ? 'blue' : index % 5 === 1 ? 'green' : index % 5 === 2 ? 'yellow' : index % 5 === 3 ? 'purple' : 'gray'}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interview Stats */}
        <div className="text-right flex flex-col items-end">
          <div className="font-semibold text-blue-600">{interviews.length} Interviews</div>
          {lastInterview && (
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Last: {lastInterview.days} days ago
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 text-sm text-gray-700">{description}</div>

      {/* Interview badges */}
      {interviews && interviews.length > 0 && (
        <div className="mt-3">
          <div className="text-xs uppercase text-gray-500 mb-1">Completed Interviews</div>
          <div className="flex flex-wrap gap-2">
            {interviews.slice(0, 3).map((interview, index) => (
              <div key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                {interview.title}
              </div>
            ))}
            {interviews.length > 3 && (
              <div className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                +{interviews.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer action */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {salary && salary !== "Not specified" ? `Salary: ${salary}` : ""}
          {hourlyRate && hourlyRate !== "Not specified" ? ` · Rate: ${hourlyRate}` : ""}
        </div>
        <Link
          to={`/candidate/${id}`}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
        >
          View Profile
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default CandidateCard;