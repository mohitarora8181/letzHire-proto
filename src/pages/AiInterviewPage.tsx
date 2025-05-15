import React, { useState } from "react";
import { Search, Plus, Filter, Download, BarChart } from "lucide-react";
import { StatsCard } from "../components/ai-interview/StatusCard";
import { InterviewCard } from "../components/ai-interview/InterviewCard";
import { CreateInterviewModal } from "../components/ai-interview/modals/CreateInterviewModal";

interface InterviewerDashboardProps {
  onCreateInterview?: () => void;
}

export const InterviewerDashboard: React.FC<InterviewerDashboardProps> = ({
  onCreateInterview,
}) => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const interviews = [
    {
      id: 1,
      title: "Node.js",
      technologies: [{ name: "Node.js", color: "bg-green-100 text-green-800" }],
      status: "Practicing: Enabled",
      invited: 0,
      taken: 0,
      createdOn: "May 19, 2023",
      hasOpenJob: true,
    },
    {
      id: 2,
      title: "Front-end Developer (React.js)",
      technologies: [
        { name: "React.js", color: "bg-blue-100 text-blue-800" },
        { name: "JavaScript", color: "bg-yellow-100 text-yellow-800" },
        { name: "Redux", color: "bg-purple-100 text-purple-800" },
        { name: "GraphQL", color: "bg-pink-100 text-pink-800" },
        { name: "Jest", color: "bg-red-100 text-red-800" },
      ],
      status: "Practicing: Enabled",
      codingExercise: true,
      invited: 1,
      taken: 0,
      createdOn: "May 14, 2023",
      hasOpenJob: false,
      highlighted: true,
    },
    {
      id: 3,
      title: "Front-end developer",
      technologies: [{ name: "React.js", color: "bg-blue-100 text-blue-800" }],
      status: "Practicing: Enabled",
      codingExercise: true,
      invited: 1,
      taken: 0,
      createdOn: "May 11, 2023",
      hasOpenJob: true,
    },
  ];

  const handleDefineNewInterview = () => {
    setIsCreateMenuOpen(false);

    if (onCreateInterview) {
      onCreateInterview();
    } else {
      setIsCreateModalOpen(true);
    }
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
            value="12"
            trend="+33% this month"
            className="bg-white border border-gray-100"
          />
          <StatsCard
            title="Active Interviews"
            value="8"
            trend="+2 this week"
            className="bg-white border border-gray-100"
          />
          <StatsCard
            title="Completed Interviews"
            value="45"
            trend="+12% vs last month"
            className="bg-white border border-gray-100"
          />
          <StatsCard
            title="Average Score"
            value="8.4"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {interviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      </div>

      {/* Create Interview Modal - only used if onCreateInterview prop is not provided */}
      {!onCreateInterview && (
        <CreateInterviewModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </>
  );
};
