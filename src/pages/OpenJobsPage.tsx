import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import JobCard from '../components/jobs/JobCard';
import CreateJobModal from '../components/jobs/CreateJobModal';

const mockJobs = [
  {
    id: '1',
    title: 'Front-end Developer (React.js)',
    date: 'May 11, 2025',
    owner: 'Nirmal Kumar Meher',
    applicants: 31,
    vetted: 0,
    jobType: ['Full Time', 'Remote'],
    budget: '$100.00 - $200.00',
    skills: ['1 skill'],
    openings: 1
  },
  {
    id: '2',
    title: 'Senior React Native Developer',
    date: 'May 10, 2025',
    owner: 'Priya Sharma',
    applicants: 24,
    vetted: 12,
    jobType: ['Contract', 'Remote'],
    budget: '$90.00 - $120.00',
    skills: ['React Native', 'TypeScript'],
    openings: 2
  },
  {
    id: '3',
    title: 'Full Stack JavaScript Engineer',
    date: 'May 8, 2025',
    owner: 'John Smith',
    applicants: 47,
    vetted: 19,
    jobType: ['Full Time', 'Hybrid'],
    budget: '$120.00 - $150.00',
    skills: ['Node.js', 'React', 'MongoDB'],
    openings: 3
  }
];

const OpenJobsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState(mockJobs);

  const handleCreateJob = (jobData: any) => {
    const newJob = {
      id: (jobs.length + 1).toString(),
      title: jobData.title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      owner: 'Current User',
      applicants: 0,
      vetted: 0,
      jobType: [jobData.jobType],
      budget: jobData.minBudget && jobData.maxBudget ? `₹${jobData.minBudget} - ₹${jobData.maxBudget}` : 'Not specified',
      skills: jobData.skills.split(',').map((s: string) => s.trim()),
      openings: parseInt(jobData.hires, 10)
    };

    setJobs([newJob, ...jobs]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Open a job ({jobs.length})</h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="text-sm"
          >
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
        {jobs.map((job) => (
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