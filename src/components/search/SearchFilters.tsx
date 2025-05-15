import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState({
    skills: initialFilters.skills || [],
    experienceMin: initialFilters.experienceMin || '',
    experienceMax: initialFilters.experienceMax || '',
    salaryMin: initialFilters.salaryMin || '',
    salaryMax: initialFilters.salaryMax || '',
    countries: initialFilters.countries || []
  });

  const [skillInput, setSkillInput] = useState('');
  const [countryInput, setCountryInput] = useState('');

  // Reset filters when initial filters change
  useEffect(() => {
    setFilters({
      skills: initialFilters.skills || [],
      experienceMin: initialFilters.experienceMin || '',
      experienceMax: initialFilters.experienceMax || '',
      salaryMin: initialFilters.salaryMin || '',
      salaryMax: initialFilters.salaryMax || '',
      countries: initialFilters.countries || []
    });
  }, [initialFilters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter((s: any) => s !== skill)
    }));
  };

  const handleAddCountry = () => {
    if (countryInput.trim()) {
      setFilters(prev => ({
        ...prev,
        countries: [...prev.countries, countryInput.trim()]
      }));
      setCountryInput('');
    }
  };

  const handleRemoveCountry = (country: string) => {
    setFilters(prev => ({
      ...prev,
      countries: prev.countries.filter((c: any) => c !== country)
    }));
  };

  const handleApply = () => {
    const processedFilters = {
      ...filters,
      experienceMin: filters.experienceMin ? parseInt(filters.experienceMin, 10) : undefined,
      experienceMax: filters.experienceMax ? parseInt(filters.experienceMax, 10) : undefined,
      salaryMin: filters.salaryMin ? parseInt(filters.salaryMin, 10) : undefined,
      salaryMax: filters.salaryMax ? parseInt(filters.salaryMax, 10) : undefined,
    };

    onApply(processedFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-25 backdrop-blur-sm flex">
      <div className="relative w-full max-w-md ml-auto h-full bg-white shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Skills</h3>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g. React, Python, TypeScript"
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={handleAddSkill}
                className="px-3"
              >
                <Plus size={16} />
              </Button>
            </div>

            {filters.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.skills.map((skill: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span className="text-sm">{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Country/Region</h3>
            <div className="flex gap-2">
              <Input
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                placeholder="e.g. India, United States"
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={handleAddCountry}
                className="px-3"
              >
                <Plus size={16} />
              </Button>
            </div>

            {filters.countries.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.countries.map((country: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span className="text-sm">{country}</span>
                    <button
                      onClick={() => handleRemoveCountry(country)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Years of experience</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Minimum</label>
                <Input
                  type="number"
                  name="experienceMin"
                  value={filters.experienceMin}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Maximum</label>
                <Input
                  type="number"
                  name="experienceMax"
                  value={filters.experienceMax}
                  onChange={handleChange}
                  placeholder="50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Salary Range (₹)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Minimum</label>
                <Input
                  type="number"
                  name="salaryMin"
                  value={filters.salaryMin}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Maximum</label>
                <Input
                  type="number"
                  name="salaryMax"
                  value={filters.salaryMax}
                  onChange={handleChange}
                  placeholder="5000000"
                />
              </div>
            </div>
          </div>

          {/* Other filters */}
          <div className="space-y-3">
            <h3 className="font-medium">AI Interview results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Select rating</label>
                <select className="w-full input p-2 border border-gray-300 rounded-md">
                  <option>Select rating</option>
                  <option>Expert</option>
                  <option>Advanced</option>
                  <option>Intermediate</option>
                  <option>Beginner</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 flex gap-2">
          <Button
            variant="outline"
            className="w-1/3"
            onClick={() => {
              setFilters({
                skills: [],
                experienceMin: '',
                experienceMax: '',
                salaryMin: '',
                salaryMax: '',
                countries: []
              });
            }}
          >
            Clear All
          </Button>
          <Button className="w-2/3" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;