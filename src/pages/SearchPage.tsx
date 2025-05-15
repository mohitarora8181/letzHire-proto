import React, { useState, useEffect } from 'react';
import { Filter, Heart } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import CandidateCard from '../components/search/CandidateCard';
import SearchFilters from '../components/search/SearchFilters';

// Define types for filters
interface Filters {
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  countries?: string[];
}

const mockCandidates = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    position: 'Software Engineer/Data Scientist',
    experience: 15,
    country: 'India',
    countryFlag: '🇮🇳',
    skills: ['C++ Algorithm Problem-Solving', 'Data Structures', 'Debugging And Testing'],
    salary: '₹12,50,000/month',
    hourlyRate: '₹7,200/h',
    verified: true,
    description: 'Deployed advanced caching solutions at Flipkart and developed high-performance data pipelines at Google Bangalore. IIT Delhi alumnus with strong engineering background and expertise in scalable systems.',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'Priya Mehta',
    position: 'Software Engineer',
    experience: 9,
    country: 'India',
    countryFlag: '🇮🇳',
    skills: ['Fundamental Mathematics', 'Simplifying Complex Concepts', 'Geometry'],
    salary: '₹5,80,000/month',
    hourlyRate: '₹3,350/h',
    verified: true,
    description: 'Developed groundbreaking AI-driven algorithms at Amazon India, leveraging a PhD in Mathematics from IISc Bangalore. Previously worked at Infosys with strong engineering skills in machine learning applications.',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    name: 'Kiran Verma',
    position: 'Senior Recruiter',
    experience: 10,
    country: 'India',
    countryFlag: '🇮🇳',
    skills: ['Technical Recruitment', 'Behavioral Analysis', 'Recruitment Tools'],
    salary: '₹3,90,000/month',
    hourlyRate: '₹2,250/h',
    verified: true,
    description: 'Expert recruiter specializing in technical talent acquisition with over 10 years of experience in the Indian tech market. Strong background in behavioral analysis and implementation of modern recruitment tools.',
    photo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const SearchPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [filteredCandidates, setFilteredCandidates] = useState(mockCandidates);

  // Helper function to parse salary string into number
  const parseSalary = (salaryString: string): number => {
    // Convert "₹12,50,000/month" to 1250000
    return parseInt(salaryString.replace(/[₹,/month]/g, ''), 10);
  };

  // Apply filters and search whenever they change
  useEffect(() => {
    let results = [...mockCandidates];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(candidate =>
        candidate.name.toLowerCase().includes(query) ||
        candidate.position.toLowerCase().includes(query) ||
        candidate.description.toLowerCase().includes(query) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (activeFilters.skills && activeFilters.skills.length > 0) {
      results = results.filter(candidate =>
        activeFilters.skills!.some(skill =>
          candidate.skills.some(candidateSkill =>
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (activeFilters.experienceMin || activeFilters.experienceMax) {
      results = results.filter(candidate => {
        if (activeFilters.experienceMin && candidate.experience < activeFilters.experienceMin) {
          return false;
        }
        if (activeFilters.experienceMax && candidate.experience > activeFilters.experienceMax) {
          return false;
        }
        return true;
      });
    }

    if (activeFilters.salaryMin || activeFilters.salaryMax) {
      results = results.filter(candidate => {
        const candidateSalary = parseSalary(candidate.salary);
        if (activeFilters.salaryMin && candidateSalary < activeFilters.salaryMin) {
          return false;
        }
        if (activeFilters.salaryMax && candidateSalary > activeFilters.salaryMax) {
          return false;
        }
        return true;
      });
    }

    if (activeFilters.countries && activeFilters.countries.length > 0) {
      results = results.filter(candidate =>
        activeFilters.countries!.includes(candidate.country)
      );
    }

    setFilteredCandidates(results);
  }, [searchQuery, activeFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const handleApplyFilters = (filters: Filters) => {
    setActiveFilters(filters);
    setShowFilters(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative mb-4">
          <Input
            type="text"
            icon
            placeholder="ex: react native developer with 4 years of experience and a passion for startups."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-28"
          />
          <div className="absolute right-1 top-0.5 max-h-[90%] flex space-x-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8"
              onClick={() => setShowFilters(true)}
            >
              <Filter size={16} className="mr-1" />
              Filters {Object.keys(activeFilters).length > 0 && `(${Object.keys(activeFilters).length})`}
            </Button>
            <Button type="button" variant="secondary" size="sm" className="h-8">
              <Heart size={16} className="mr-1" />
              View favorites
            </Button>
          </div>
        </form>

        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <span>Sort by</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Button>
          {Object.keys(activeFilters).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-500"
              onClick={() => setActiveFilters({})}
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredCandidates.length > 0 ? (
          filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              {...candidate}
            />
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No candidates match your current filters.</p>
            {Object.keys(activeFilters).length > 0 && (
              <Button
                variant="outline"
                onClick={() => setActiveFilters({})}
                className="mt-2"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      <SearchFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </div>
  );
};

export default SearchPage;