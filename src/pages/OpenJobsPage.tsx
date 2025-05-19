import React, { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import JobCard from "../components/jobs/JobCard";
import CreateJobModal from "../components/jobs/CreateJobModal";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";

const OpenJobsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, "jobs"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);

        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setJobs(jobsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleCreateJob = async (jobData: any) => {
    const newJob = {
      title: jobData.title,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      owner: "Current User",
      applicants: 0,
      vetted: 0,
      jobType: [jobData.jobType],
      budget:
        jobData.minBudget && jobData.maxBudget
          ? `₹${jobData.minBudget} - ₹${jobData.maxBudget}`
          : "Not specified",
      skills: jobData.skills.split(",").map((s: string) => s.trim()),
      openings: parseInt(jobData.hires, 10),
    };

    try {
      const docRef = await addDoc(collection(db, "jobs"), newJob);
      setJobs([{ id: docRef.id, ...newJob }, ...jobs]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex justify-between items-center mb-8 animate-[slideInDown_0.5s_ease-out]">
        <h1 className="text-2xl font-bold text-gray-900">
          Open Jobs <span className="text-gray-500">({jobs.length})</span>
        </h1>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="text-sm px-4 py-2 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Closed jobs
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <Plus size={18} className="mr-2" /> Add a job
          </Button>
        </div>
      </div>

      <div className="mb-8 flex gap-3 animate-[slideInUp_0.5s_ease-out]">
        <div className="relative flex-1">
          <Input
            type="text"
            icon
            placeholder="Search jobs by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
        </div>
        <Button
          variant="secondary"
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <Filter size={18} />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job, index) => (
            <div
              key={job.id}
              className="opacity-0 animate-[slideInRight_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <JobCard {...job} />
            </div>
          ))}
          {filteredJobs.length === 0 && (
            <div className="text-center py-12 text-gray-500 animate-[fadeIn_0.5s_ease-out]">
              No jobs found matching your search criteria.
            </div>
          )}
        </div>
      )}

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateJob}
      />
    </div>
  );
};

export default OpenJobsPage;
