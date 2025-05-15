import React from 'react';
import { MoreVertical } from 'lucide-react';
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
}) => {
  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={photo}
          alt={name}
          className="w-16 h-16 rounded-md object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{name}</h3>
              {verified && (
                <span className="text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53-1.471-1.472a.75.75 0 00-1.06 1.06l2 2.001a.75.75 0 001.137-.089l3.85-5.158z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {position} · Exp: {experience} years · {country} {countryFlag}
          </div>
          <div className="mt-2">
            <div className="text-sm font-medium">Vetted skills:</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {skills.map((skill, index) => (
                <Badge key={index} color={index % 2 === 0 ? 'blue' : 'green'}>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-semibold">{salary}</div>
          <div className="text-sm text-gray-500">({hourlyRate})</div>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-gray-700">{description}</div>
      
      <div className="mt-3 flex justify-end">
        <Link 
          to={`/candidate/${id}`}
          className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
        >
          View details
        </Link>
      </div>
    </div>
  );
};

export default CandidateCard;