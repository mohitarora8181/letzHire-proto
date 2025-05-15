import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Edit, ArrowLeft, Users, Briefcase, MapPin, DollarSign } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';


interface JobDetails {
  id: string;
  title: string;
  date: string;
  owner: string;
  description: string;
  requirements: string[];
  jobType: string;
  location: string;
  budget: string;
  skills: string[];
  openings: number;
  applicants: Array<{
    id: string;
    name: string;
    position: string;
    experience: number;
    country: string;
    countryFlag: string;
    skills: string[];
    matchScore: number;
    appliedDate: string;
  }>;
}

const mockJobDetails: Record<string, JobDetails> = {
  '1': {
    id: '1',
    title: 'Front-end Developer (React.js)',
    date: 'May 11, 2025',
    owner: 'Nirmal Kumar Meher',
    description: 'We are looking for an experienced Front-end Developer with expertise in React.js to join our growing team. The ideal candidate will be responsible for developing and implementing user interface components using React.js concepts and workflows such as Redux, Hooks, and Context API. You will also be responsible for profiling and improving front-end performance and documenting our front-end codebase.',
    requirements: [
      'Strong proficiency in JavaScript and TypeScript',
      'Thorough understanding of React.js and its core principles',
      'Experience with Redux, Context API, and React Hooks',
      'Experience with common front-end development tools',
      'Familiarity with code versioning tools like Git'
    ],
    jobType: 'Full Time',
    location: 'Remote',
    budget: '₹8,25,000 - ₹16,50,000',
    skills: ['React.js', 'JavaScript', 'Redux'],
    openings: 1,
    applicants: [
      {
        id: '201',
        name: 'Venkatesh Chitragar',
        position: 'React Frontend Developer',
        experience: 7.7,
        country: 'India',
        countryFlag: '🇮🇳',
        skills: ['ReactJS', 'Redux', 'TypeScript'],
        matchScore: 95,
        appliedDate: 'May 14, 2025'
      },
      {
        id: '202',
        name: 'Ananya Sharma',
        position: 'Senior Frontend Engineer',
        experience: 9.7,
        country: 'India',
        countryFlag: '🇮🇳',
        skills: ['JavaScript', 'React', 'Next.js'],
        matchScore: 94.5,
        appliedDate: 'May 11, 2025'
      },
      {
        id: '203',
        name: 'Rahul Mehta',
        position: 'Software Engineer',
        experience: 7,
        country: 'India',
        countryFlag: '🇮🇳',
        skills: ['React', 'Redux', 'Material UI'],
        matchScore: 92.75,
        appliedDate: 'May 12, 2025'
      }
    ]
  }
};

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && mockJobDetails[id]) {
      setJob(mockJobDetails[id]);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-700">Job not found.</p>
        <Link to="/jobs" className="text-indigo-600 hover:text-indigo-800 font-medium mt-4 inline-block">
          Return to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link to="/jobs" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to all jobs
        </Link>

        <div className="card">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <div className="text-sm text-gray-500 mt-1">
                  {job.date} | Owner: {job.owner}
                </div>
              </div>
              <Button variant="secondary" size="sm" className="flex items-center">
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center">
                <Briefcase size={18} className="text-gray-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Job Type</div>
                  <div className="font-medium">{job.jobType}</div>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin size={18} className="text-gray-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium">{job.location}</div>
                </div>
              </div>

              <div className="flex items-center">
                <DollarSign size={18} className="text-gray-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Budget</div>
                  <div className="font-medium">{job.budget}</div>
                </div>
              </div>

              <div className="flex items-center">
                <Users size={18} className="text-gray-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Openings</div>
                  <div className="font-medium">{job.openings}</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{job.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Requirements</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {job.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, index: number) => (
                  <Badge key={index}>{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-8 py-4 border-t border-gray-200">
              <Button className="w-full">
                Use our AI interviewer to vet your candidates for this job
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Applicants ({job.applicants.length})</h2>
          <Button variant="secondary" size="sm">
            Invite top 50% to AI interview
          </Button>
        </div>

        <div className="card">
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-3 font-medium text-gray-700">Name</th>
                    <th className="pb-3 font-medium text-gray-700">Skills</th>
                    <th className="pb-3 font-medium text-gray-700">Match Score</th>
                    <th className="pb-3 font-medium text-gray-700">Applied Date</th>
                    <th className="pb-3 font-medium text-gray-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {job.applicants.map((applicant: any) => (
                    <tr key={applicant.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                          <div>
                            <div className="font-medium">{applicant.name}</div>
                            <div className="text-sm text-gray-500">
                              {applicant.position} · Exp: {applicant.experience} years · {applicant.country} {applicant.countryFlag}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {applicant.skills.map((skill: string, i: number) => (
                            <Badge key={i} color={i % 2 === 0 ? 'blue' : 'gray'}>
                              {skill}
                            </Badge>
                          ))}
                          {applicant.skills.length > 2 && (
                            <span className="text-gray-500 text-sm">+{applicant.skills.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          AI Match Score: {applicant.matchScore}%
                        </div>
                      </td>
                      <td className="py-4 text-gray-500">
                        Applied on {applicant.appliedDate}
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-gray-500 hover:text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;