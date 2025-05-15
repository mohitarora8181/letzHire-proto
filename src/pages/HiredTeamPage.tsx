import React from 'react';
import { Users, Search as SearchIcon, Filter } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import CandidateCard from '../components/search/CandidateCard';

const mockTeamMembers = [
  {
    id: '101',
    name: 'A.S.',
    position: 'Senior Frontend Developer',
    experience: 8,
    country: 'Canada',
    countryFlag: '🇨🇦',
    skills: ['React', 'TypeScript', 'UI/UX Design'],
    salary: '$12,000/month',
    hourlyRate: '$70/h',
    verified: true,
    description: 'Lead frontend developer working on our core product. Expert in React ecosystem with strong UI/UX skills. Previously at Shopify.',
    photo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '102',
    name: 'P.M.',
    position: 'Backend Engineer',
    experience: 6,
    country: 'Germany',
    countryFlag: '🇩🇪',
    skills: ['Node.js', 'Python', 'MongoDB'],
    salary: '$10,500/month',
    hourlyRate: '$62/h',
    verified: true,
    description: 'Skilled backend developer handling our API architecture and database optimizations. Strong experience with microservices.',
    photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '103',
    name: 'S.K.',
    position: 'DevOps Engineer',
    experience: 7,
    country: 'Australia',
    countryFlag: '🇦🇺',
    skills: ['AWS', 'Kubernetes', 'CI/CD'],
    salary: '$11,200/month',
    hourlyRate: '$65/h',
    verified: true,
    description: 'Infrastructure and DevOps expert managing our cloud deployments and CI/CD pipelines. Previously at Atlassian.',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const HiredTeamPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="bg-indigo-100 p-3 rounded-md mr-4">
          <Users size={24} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Your Hired Team</h1>
          <p className="text-gray-500">Manage your currently hired professionals</p>
        </div>
      </div>
      
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            icon
            placeholder="Search team members"
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
        {mockTeamMembers.map((member) => (
          <CandidateCard key={member.id} {...member} />
        ))}
      </div>
    </div>
  );
};

export default HiredTeamPage;