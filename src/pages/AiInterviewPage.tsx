import React, { useState, useEffect } from "react";
import { getInterviews } from "../api/getInterview";
import { createInterview } from "../api/createInterview";
import { Search, Plus, Filter, Download, BarChart, User, X, Loader2 } from "lucide-react";
import { StatsCard } from "../components/ai-interview/StatusCard";
import { InterviewCard } from "../components/ai-interview/InterviewCard";
import { CreateInterviewModal } from "../components/ai-interview/modals/CreateInterviewModal";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface Student {
  id: string;
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  completedOn?: string;
}

interface InterviewerDashboardProps {
  onCreateInterview?: () => void;
}

export const InterviewerDashboard: React.FC<InterviewerDashboardProps> = ({
  onCreateInterview,
}) => {
  const navigate = useNavigate();
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [averageScore, setAverageScore] = useState("8.4");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getInterviews();
      setInterviews(data);
      setLoading(false);

      setTotal(data.length);
      const activeCount = data.filter((i: any) => i.taken < i.invited).length;
      const completedCount = data.filter(
        (i: any) => i.taken >= i.invited
      ).length;
      setActive(activeCount);
      setCompleted(completedCount);
    };

    fetchData();
  }, []);

  const handleDefineNewInterview = () => {
    setIsCreateMenuOpen(false);

    if (onCreateInterview) {
      onCreateInterview();
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handleViewStudents = async (interview: any) => {
    setSelectedInterview(interview);
    setIsStudentModalOpen(true);
    setLoadingStudents(true);

    try {
      const db = getFirestore();

      if (!interview.students || interview.students.length === 0) {
        setStudents([]);
        setLoadingStudents(false);
        return;
      }

      const studentPromises = interview.students.map(async (studentId: string) => {
        const userDoc = await getDoc(doc(db, "users", studentId));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          let completedOn = "";
          if (userData.interviews) {
            const matchingInterview = userData.interviews.find(
              (i: any) => i.interviewId === interview.id
            );
            if (matchingInterview) {
              completedOn = matchingInterview.completedOn;
            }
          }

          return {
            id: userDoc.id,
            uid: userData.uid || userDoc.id,
            name: userData.name || "Unknown",
            email: userData.email || "",
            photoURL: userData.photoURL || "",
            completedOn,
          };
        }
        return null;
      });

      const fetchedStudents = (await Promise.all(studentPromises)).filter(
        (student) => student !== null
      ) as Student[];

      fetchedStudents.sort((a, b) => {
        if (!a.completedOn) return 1;
        if (!b.completedOn) return -1;
        return new Date(b.completedOn).getTime() - new Date(a.completedOn).getTime();
      });

      setStudents(fetchedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const navigateToCandidate = (studentId: string) => {
    navigate(`/candidate/${studentId}`);
    setIsStudentModalOpen(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Interviewer
            </h1>
            <p className="text-gray-500">
              Create and manage your AI-powered interview processes
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <BarChart size={18} className="mr-2" />
              View Analytics
            </button>
            <div className="relative">
              <button
                onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus size={18} className="mr-2" />
                Create new interview
              </button>
              {isCreateMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10 animate-fadeIn">
                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={handleDefineNewInterview}
                  >
                    Define new interview
                  </button>
                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsCreateMenuOpen(false)}
                  >
                    Choose from saved interviews
                  </button>
                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsCreateMenuOpen(false)}
                  >
                    Choose from open jobs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Interviews"
            value={total.toString()}
            trend="+33% this month"
            className="bg-white border border-gray-100"
          />
          <StatsCard
            title="Active Interviews"
            value={active.toString()}
            trend="+2 this week"
            className="bg-white border border-gray-100"
          />
          <StatsCard
            title="Completed Interviews"
            value={completed.toString()}
            trend="+12% vs last month"
            className="bg-white border border-gray-100"
          />
          <StatsCard
            title="Average Score"
            value={averageScore}
            trend="No change"
            className="bg-white border border-gray-100"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex-1 min-w-[280px] max-w-xl relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search interviews..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Filter size={18} className="mr-2" />
              Filters
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Download size={18} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Interviews Grid */}
        {loading ? (
          <div>Loading interviews...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onViewStudents={() => handleViewStudents(interview)}
              />
            ))}
          </div>
        )}
      </div>

      {!onCreateInterview && (
        <CreateInterviewModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isStudentModalOpen && selectedInterview && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedInterview.title} - Students
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedInterview.students?.length || 0} students have completed this interview
                </p>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsStudentModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {loadingStudents ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={32} className="text-blue-500 animate-spin mr-2" />
                  <p className="text-gray-600">Loading students...</p>
                </div>
              ) : students.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="py-4 flex items-center justify-between hover:bg-gray-50 rounded-lg cursor-pointer px-3"
                      onClick={() => navigateToCandidate(student.id)}
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          {student.photoURL ? (
                            <img
                              src={student.photoURL}
                              alt={student.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User size={24} className="h-full w-full p-2 text-gray-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-gray-600 text-sm">{student.email}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Completed on {formatDate(student.completedOn)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No students have completed this interview yet.
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsStudentModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
