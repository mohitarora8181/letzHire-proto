import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (interviewData: any) => void;
}

const CreateInterviewModal: React.FC<CreateInterviewModalProps> = ({ isOpen, onClose, onSave }) => {
  const [interviewData, setInterviewData] = useState({
    title: '',
    description: '',
    skills: '',
    duration: 30,
    questions: 5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInterviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(interviewData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create AI Interview">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interview Title*
          </label>
          <Input
            name="title"
            value={interviewData.title}
            onChange={handleChange}
            placeholder="e.g. Frontend React Developer Interview"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            name="description"
            value={interviewData.description}
            onChange={handleChange}
            placeholder="Briefly describe what this interview will assess"
            rows={3}
            className="w-full input"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills to Assess*
          </label>
          <Input
            name="skills"
            value={interviewData.skills}
            onChange={handleChange}
            placeholder="e.g. React, TypeScript, Problem Solving"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interview Duration (minutes)*
            </label>
            <select
              name="duration"
              value={interviewData.duration}
              onChange={handleChange}
              className="w-full input"
              required
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions*
            </label>
            <select
              name="questions"
              value={interviewData.questions}
              onChange={handleChange}
              className="w-full input"
              required
            >
              <option value={3}>3 questions</option>
              <option value={5}>5 questions</option>
              <option value={7}>7 questions</option>
              <option value={10}>10 questions</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit">
            Create Interview
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateInterviewModal;