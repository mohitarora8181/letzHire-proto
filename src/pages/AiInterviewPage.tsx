import React, { useState } from 'react';
import { Plus, Search as SearchIcon } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import InterviewCard from '../components/ai-interview/InterviewCard';
import CreateInterviewModal from '../components/ai-interview/CreateInterviewModal';

const mockInterviews = [
  {
    id: '1',
    title: 'React Frontend Developer Interview',
    description: 'This interview focuses on assessing React skills, state management, and component design patterns for frontend developer candidates.',
    date: 'May 15, 2025',
    candidates: 24,
    skills: ['React', 'JavaScript', 'CSS', 'Component Design']
  },
  {
    id: '2',
    title: 'Full Stack JavaScript Engineer Assessment',
    description: 'Comprehensive evaluation of full stack skills including Node.js, Express, React, and database knowledge.',
    date: 'May 12, 2025',
    candidates: 18,
    skills: ['Node.js', 'Express', 'React', 'MongoDB']
  },
  {
    id: '3',
    title: 'Data Scientist Technical Interview',
    description: 'Advanced assessment of machine learning algorithms, statistical analysis, and data visualization techniques.',
    date: 'May 10, 2025',
    candidates: 16,
    skills: ['Python', 'Machine Learning', 'Statistics', 'Data Visualization']
  },
  {
    id: '4',
    title: 'DevOps Engineer Skills Evaluation',
    description: 'Evaluates skills in CI/CD pipelines, containerization, cloud infrastructure, and automation.',
    date: 'May 8, 2025',
    candidates: 12,
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD']
  }
];

const AiInterviewPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [interviews, setInterviews] = useState(mockInterviews);

  const handleCreateInterview = (interviewData: any) => {
    const newInterview = {
      id: (interviews.length + 1).toString(),
      title: interviewData.title,
      description: interviewData.description,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      candidates: 0,
      skills: interviewData.skills.split(',').map((s: string) => s.trim())
    };
    
    setInterviews([newInterview, ...interviews]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">AI Interviewer</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="text-sm"
        >
          <Plus size={18} className="mr-1" /> Create Interview
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          type="text"
          icon
          placeholder="Search interviews"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {interviews.map((interview) => (
          <InterviewCard key={interview.id} {...interview} />
        ))}
      </div>
      
      <CreateInterviewModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateInterview}
      />
    </div>
  );
};

export default AiInterviewPage;