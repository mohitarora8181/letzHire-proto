import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Heart, Copy, Calendar, Star, Loader2, ExternalLink, Volume2 } from 'lucide-react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Button from '../components/common/Button';

// Define your API token
const VAPI_API_TOKEN = import.meta.env.VITE_VAPI_API_TOKEN || "b33bd21d-c08c-4bc2-a28c-3618737743fa"; // Replace with env variable

interface InterviewData {
  callId: string;
  completedOn: string;
  interviewId: string;
  status: string;
  title: string;
}

interface TranscriptItem {
  role: "user" | "assistant" | "bot" | "system";
  content: string;
  message?: string;
  time?: number;
  timestamp?: number;
}

interface CallData {
  id: string;
  endedAt: Date;
  startedAt: Date;
  transcript: string;
  recordingUrl: string;
  stereoRecordingUrl: string;
  summary: string;
  messages: TranscriptItem[];
  analysis: {
    summary: string;
  };
}

interface Candidate {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  position?: string;
  experience?: number;
  country?: string;
  countryFlag?: string;
  skills?: string[];
  salary?: string;
  hourlyRate?: string;
  verified?: boolean;
  description?: string;
  createdAt?: any; // Firestore timestamp
  interviews?: InterviewData[];
}

const CandidateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeInterview, setActiveInterview] = useState<string | null>(null);

  // New state for handling call data
  const [callData, setCallData] = useState<CallData | null>(null);
  const [loadingCall, setLoadingCall] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);

  // Fetch candidate data from Firestore
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) {
        setError("No candidate ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const db = getFirestore();

        // Get user document
        const userDocRef = doc(db, "users", id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as Candidate;
          setCandidate({
            ...userData,
          });

          // If there are interviews, set the first one as active
          if (userData.interviews && userData.interviews.length > 0) {
            setActiveInterview(userData.interviews[0].callId);
          }
        } else {
          setError("Candidate not found");
        }
      } catch (err) {
        console.error("Error fetching candidate:", err);
        setError("Failed to load candidate data");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  // Fetch call data when active interview changes
  useEffect(() => {
    const fetchCallData = async () => {
      if (!activeInterview) return;

      setLoadingCall(true);
      setCallError(null);

      try {
        const response = await fetch(`https://api.vapi.ai/call/${activeInterview}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${VAPI_API_TOKEN}`
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch interview data: ${response.statusText}`);
        }

        const data = await response.json();
        setCallData(data);
      } catch (err) {
        console.error("Error fetching call data:", err);
        setCallError("Failed to load interview recording and transcript");
      } finally {
        setLoadingCall(false);
      }
    };

    fetchCallData();
  }, [activeInterview]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format transcript messages for display
  const formatMessages = (messages: any[] | undefined) => {
    if (!messages) return [];

    return messages
      .filter(msg => {
        // Filter out system messages and empty messages
        return (msg.role === 'user' || msg.role === 'bot' || msg.role === 'assistant')
          && (msg.message || msg.content);
      })
      .map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : msg.role,
        content: msg.message || msg.content,
        timestamp: msg.time || msg.timestamp || Date.now()
      }));
  };

  // Determine skill levels based on interview count
  const getSkillLevel = (index: number): string => {
    const levels = ["Beginner", "Intermediate", "Experienced", "Senior"];
    return levels[Math.min(index, levels.length - 1)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mr-2" />
        <p className="text-lg">Loading candidate data...</p>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600">{error || "Candidate not found."}</p>
        <Link to="/search" className="text-indigo-600 hover:text-indigo-800 font-medium mt-4 inline-block">
          Return to search
        </Link>
      </div>
    );
  }

  // Determine last interview date
  const lastInterviewDate = candidate.interviews && candidate.interviews.length > 0
    ? formatDate(candidate.interviews[0].completedOn)
    : "No interviews yet";

  // Prepare structured skills for display
  const displaySkills = candidate.skills
    ? candidate.skills.map((skill, i) => ({
      name: skill,
      level: getSkillLevel(i % 4),
      experience: candidate.experience
        ? `${Math.max(1, Math.round(candidate.experience / 2))} yrs experience`
        : undefined
    }))
    : [];

  // Get current interview data
  const currentInterview = candidate.interviews?.find(i => i.callId === activeInterview);

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/search" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to search results
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center text-center">
              <img
                src={candidate.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`}
                alt={candidate.name}
                className="w-20 h-20 rounded-full object-cover shadow-sm border-2 border-gray-100"
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
                {candidate.position || "Student"}
              </div>

              <div className="text-sm text-gray-600 mt-2">
                {candidate.country || "Location not specified"} {candidate.countryFlag || "🇮🇳"}
              </div>

              <div className="text-sm mt-2">
                <span className="text-gray-600">
                  {candidate.experience ? `${candidate.experience} years experience` : "Entry level"}
                </span>
              </div>

              <div className="mt-3">
                <div className="font-semibold">{candidate.email}</div>
                {candidate.salary && <div className="text-sm text-gray-500">Salary: {candidate.salary}</div>}
                {candidate.hourlyRate && <div className="text-sm text-gray-500">Rate: {candidate.hourlyRate}</div>}
              </div>

              <div className="text-sm text-gray-600 mt-4 flex items-center">
                <Calendar size={14} className="mr-1" />
                Last interview: {lastInterviewDate}
              </div>
            </div>

            {/* <div className="mt-6">
              <p className="text-sm text-gray-700">
                {candidate.description || `${candidate.name} is a student on our platform with ${candidate.interviews?.length || 0} completed interviews.`}
              </p>
            </div> */}

            <div className="mt-6 grid grid-cols-1 gap-2">
              <Button className="w-full">
                Request interview
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Skills Summary</h2>

            {displaySkills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displaySkills.map((skill, index) => (
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
                            skill.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {skill.level}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No skills information available</p>
            )}

            <div className="mt-4 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-indigo-600">
                  <Star size={18} />
                </div>
                <div>
                  <div className="font-medium">Communication skills</div>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {candidate.interviews && candidate.interviews.length > 3 ? "Advanced" :
                    candidate.interviews && candidate.interviews.length > 1 ? "Intermediate" : "Beginner"}
                </span>
              </div>
            </div>
          </div>

          {candidate.interviews && candidate.interviews.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Interview History</h2>

              {/* Interview selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {candidate.interviews.map((interview) => (
                  <button
                    key={interview.callId}
                    onClick={() => setActiveInterview(interview.callId)}
                    className={`px-3 py-2 text-sm rounded-md ${activeInterview === interview.callId
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {interview.title}
                  </button>
                ))}
              </div>

              {activeInterview && loadingCall && (
                <div className="py-12 text-center">
                  <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Loading interview data...</p>
                </div>
              )}

              {activeInterview && callError && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <p className="text-red-700">{callError}</p>
                </div>
              )}

              {activeInterview && callData && (
                <>
                  {/* Interview summary */}
                  <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-indigo-800 mb-2">Summary</h3>
                    <p className="text-gray-700">{callData.analysis?.summary || callData.summary}</p>
                  </div>

                  {/* Recording player */}
                  <div className="relative bg-gray-900 rounded-lg mb-6 p-6">
                    <div className="flex items-center">
                      <a
                        href={callData.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white bg-opacity-25 rounded-full flex items-center justify-center mr-4"
                      >
                        <Play size={24} className="text-white ml-1" />
                      </a>

                      <div className="text-white">
                        <div className="font-medium">{currentInterview?.title} Recording</div>
                        <div className="text-sm text-gray-300 mt-1">
                          {currentInterview && formatDate(currentInterview.completedOn)}
                          {callData.endedAt && ` • ${Math.round((new Date(callData.endedAt).getTime() - new Date(callData.startedAt).getTime()) / 1000 / 60)} mins`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transcript */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">TRANSCRIPT</h3>
                      <button
                        className="text-indigo-600 hover:text-indigo-800 flex items-center"
                        title="Download transcript"
                        onClick={() => {
                          // Create blob and download
                          const blob = new Blob([callData.transcript], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${currentInterview?.title}-transcript.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <ExternalLink size={16} className="mr-1" />
                        Download transcript
                      </button>
                    </div>

                    <div className="overflow-y-auto max-h-[600px] border border-gray-200 rounded-lg">
                      {/* Formatted transcript messages for better readability */}
                      {callData.messages && formatMessages(callData.messages).length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {formatMessages(callData.messages).map((item, index) => (
                            <div key={index} className={`p-4 ${item.role === 'assistant' ? 'bg-gray-50' : 'bg-blue-50'}`}>
                              <div className="flex items-center mb-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${item.role === 'assistant' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                  {item.role === 'assistant' ? 'AI' : candidate.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {item.role === 'assistant' ? 'AI Interviewer' : candidate.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-700 pl-10">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Raw transcript formatted with line breaks */
                        <pre className="whitespace-pre-line text-gray-700 p-6 font-sans">
                          {callData.transcript}
                        </pre>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsPage;