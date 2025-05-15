import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Heart, Copy, Calendar, Star } from 'lucide-react';
import Button from '../components/common/Button';

interface Skill {
  name: string;
  experience?: string;
  level?: string;
}

interface SoftSkills {
  level: string;
}

interface TranscriptItem {
  timestamp: string;
  speaker: string;
  text: string;
}

interface Interview {
  recording: boolean;
  transcript: TranscriptItem[];
}

interface Candidate {
  id: string;
  name: string;
  verified: boolean;
  position: string;
  location: string;
  countryFlag: string;
  availability: string;
  experience: string;
  salary: string;
  hourlyRate: string;
  interviewDate: string;
  bio: string;
  photo: string;
  skills: Skill[];
  softSkills: SoftSkills;
  interview: Interview;
}

const mockCandidates: Record<string, Candidate> = {
  '1': {
    id: '1',
    name: 'Rajesh Kumar',
    verified: true,
    position: 'Software Engineer/Data Scientist',
    location: 'India',
    countryFlag: '🇮🇳',
    availability: 'Available full time',
    experience: '15+ years exp',
    salary: '₹12,50,000/month',
    hourlyRate: '₹7,200/h',
    interviewDate: 'May 10, 2025',
    bio: 'Deployed advanced caching solutions at Flipkart and developed high-performance data pipelines at Google Bangalore. IIT Delhi alumnus with strong engineering background and expertise in scalable systems. Profile includes top university education, top company experience, and strong engineering background.',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    skills: [
      {
        name: 'C++ Algorithm Problem-Solving',
        experience: '15+ yrs experience',
        level: 'Experienced'
      },
      {
        name: 'Data Structures',
        experience: '15+ yrs experience',
        level: 'Experienced'
      },
      {
        name: 'Debugging and Testing',
        experience: '15+ yrs experience',
        level: 'Experienced'
      },
      {
        name: 'Coding exercise',
        level: 'Senior'
      }
    ],
    softSkills: {
      level: 'B2 (Good)'
    },
    interview: {
      recording: true,
      transcript: [
        {
          timestamp: '00:34',
          speaker: 'Zara',
          text: 'Hello! I am micro1\'s AI interviewer. Welcome, I\'m excited to get to know you. Could you briefly introduce yourself?'
        },
        {
          timestamp: '00:42',
          speaker: 'Candidate',
          text: 'I\'m currently looking for a job after working at Google Bangalore for 6 years and Flipkart for 3 years before that.'
        },
        {
          timestamp: '00:59',
          speaker: 'Zara',
          text: 'Thank you for sharing, Rajesh Kumar. Let\'s delve into the technical part. Imagine you need to design an algorithm in C++ that finds the longest increasing subsequence in a given array of integers. Could you explain the approach?'
        }
      ]
    }
  }
};

const CandidateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && mockCandidates[id]) {
      setCandidate(mockCandidates[id]);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-700">Candidate not found.</p>
        <Link to="/search" className="text-indigo-600 hover:text-indigo-800 font-medium mt-4 inline-block">
          Return to search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/search" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to search results
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex flex-col items-center text-center">
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-20 h-20 rounded-md object-cover"
              />

              <div className="mt-4 flex items-center gap-2">
                <h1 className="text-xl font-bold">{candidate.name}</h1>
                {candidate.verified && (
                  <span className="text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53-1.471-1.472a.75.75 0 00-1.06 1.06l2 2.001a.75.75 0 001.137-.089l3.85-5.158z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-600 mt-1">
                {candidate.position}
              </div>

              <div className="text-sm text-gray-600 mt-2">
                {candidate.location} {candidate.countryFlag}
              </div>

              <div className="text-sm mt-2">
                <span className="text-gray-600">Available full time | </span>
                <span className="text-gray-600">{candidate.experience}</span>
              </div>

              <div className="mt-3">
                <div className="font-semibold">{candidate.salary}</div>
                <div className="text-sm text-gray-500">({candidate.hourlyRate})</div>
              </div>

              <div className="text-sm text-gray-600 mt-4 flex items-center">
                <Calendar size={14} className="mr-1" />
                AI interview completed on {candidate.interviewDate}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-700">
                {candidate.bio}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button className="w-full">
                Request interview
              </Button>
              <Button variant="secondary" className="w-full flex items-center justify-center">
                <Heart size={16} className="mr-1" />
                Save
              </Button>
            </div>

            <div className="mt-4 text-center">
              <button className="text-indigo-600 text-sm hover:text-indigo-800 flex items-center justify-center w-full">
                <Copy size={14} className="mr-1" />
                Find me candidates like this
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Interview result summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidate.skills.slice(0, 4).map((skill: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 text-indigo-600">
                      <Star size={18} />
                    </div>
                    <div>
                      <div className="font-medium">{skill.name}</div>
                      {skill.experience && (
                        <div className="text-sm text-gray-600 mt-1">{skill.experience}</div>
                      )}
                    </div>
                  </div>
                  {skill.level && (
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${skill.level === 'Experienced' ? 'bg-green-100 text-green-800' :
                          skill.level === 'Senior' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {skill.level}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {candidate.softSkills && (
              <div className="mt-4 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-indigo-600">
                    <Star size={18} />
                  </div>
                  <div>
                    <div className="font-medium">Soft skills</div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {candidate.softSkills.level}
                  </span>
                </div>
              </div>
            )}
          </div>

          {candidate.interview && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Recording of the AI interview</h2>

              {candidate.interview.recording && (
                <div className="relative aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white bg-opacity-25 rounded-full flex items-center justify-center">
                    <Play size={30} className="text-white ml-1" />
                  </button>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">TRANSCRIPT</h3>
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </button>
                </div>

                <div className="overflow-y-auto max-h-80 pr-2">
                  <h4 className="font-semibold mb-2 text-center">C++ Algorithm Problem Solving</h4>

                  {candidate.interview.transcript.map((item: any, index: number) => (
                    <div key={index} className="mb-4">
                      <div className="text-xs text-gray-500 mb-1">{item.timestamp} · {item.speaker}</div>
                      <p className="text-gray-700">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsPage;