import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: any) => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose, onSave }) => {
  const [jobData, setJobData] = useState({
    title: '',
    skills: '',
    description: '',
    hires: 1,
    location: '',
    jobType: 'Full Time',
    minBudget: '',
    maxBudget: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(jobData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Job">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title*
          </label>
          <Input
            name="title"
            value={jobData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Developer"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Required Skills*
          </label>
          <Input
            name="skills"
            value={jobData.skills}
            onChange={handleChange}
            placeholder="e.g. React, TypeScript, Node.js"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description*
          </label>
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleChange}
            placeholder="Describe the job responsibilities and requirements"
            rows={4}
            className="w-full input"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Hires*
            </label>
            <Input
              type="number"
              name="hires"
              value={jobData.hires}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input
              name="location"
              value={jobData.location}
              onChange={handleChange}
              placeholder="e.g. Remote, New York"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Type
          </label>
          <select
            name="jobType"
            value={jobData.jobType}
            onChange={handleChange}
            className="w-full input"
          >
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
            <option>Freelance</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Budget
            </label>
            <Input
              type="number"
              name="minBudget"
              value={jobData.minBudget}
              onChange={handleChange}
              placeholder="₹"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Budget
            </label>
            <Input
              type="number"
              name="maxBudget"
              value={jobData.maxBudget}
              onChange={handleChange}
              placeholder="₹"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit">
            Create Job
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateJobModal;