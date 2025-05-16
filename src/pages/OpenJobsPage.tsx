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

  // ✅ Fetch jobs from Firestore on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, "jobs"), orderBy("date", "desc")); // optional: sort by date
        const querySnapshot = await getDocs(q);

        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
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
      console.log("Document written with ID: ", docRef.id);
      setJobs([{ id: docRef.id, ...newJob }, ...jobs]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Open a job ({jobs.length})</h1>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-sm">
            Closed jobs
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-sm"
          >
            <Plus size={18} className="mr-1" /> Add a job
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            icon
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="secondary" className="flex items-center gap-1">
          <Filter size={18} />
          Filters
        </Button>
      </div>

      <div className="space-y-4">
        {jobs
          .filter((job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
      </div>

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateJob}
      />
    </div>
  );
};

export default OpenJobsPage;
