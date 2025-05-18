import React, { useState, useEffect } from 'react';
import { Filter, Heart, AlertCircle, Loader2 } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import CandidateCard from '../components/search/CandidateCard';
import SearchFilters from '../components/search/SearchFilters';
import { collection, getDocs, query, where, getFirestore } from 'firebase/firestore';

// Define types for filters
interface Filters {
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  countries?: string[];
}

// Define candidate interface based on Firestore structure
interface Candidate {
  id: string;
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  interviews?: Array<{
    callId: string;
    completedOn: string;
    interviewId: string;
    status: string;
    title: string;
  }>;
  position?: string;
  experience?: number;
  country?: string;
  countryFlag?: string;
  skills?: string[];
  salary?: string;
  hourlyRate?: string;
  verified?: boolean;
  description?: string;
}

const SearchPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const db = getFirestore();

        // Query Firestore for users where isHR is false
        const q = query(collection(db, "users"), where("isHR", "==", false));
        const querySnapshot = await getDocs(q);

        const fetchedCandidates: Candidate[] = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();

          // Transform Firestore data to match the Candidate interface
          const candidate: Candidate = {
            id: doc.id,
            uid: userData.uid || doc.id,
            name: userData.name || "Unknown",
            email: userData.email || "",
            photoURL: userData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
            interviews: userData.interviews || [],
            // Set some default values for fields that might not be in Firestore yet
            position: userData.position || "Student",
            experience: userData.experience || 0,
            country: userData.country || "Unknown",
            countryFlag: userData.countryFlag || "🌍",
            skills: userData.skills || [],
            salary: userData.salary || "Not specified",
            hourlyRate: userData.hourlyRate || "Not specified",
            verified: userData.verified || false,
            description: userData.description || ``,
          };

          fetchedCandidates.push(candidate);
        });

        setCandidates(fetchedCandidates);
        setFilteredCandidates(fetchedCandidates);
        setError(null);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Helper function to parse salary string into number (if needed)
  const parseSalary = (salaryString: string): number => {
    // Handle "Not specified" case
    if (salaryString === "Not specified") return 0;

    // Convert "₹12,50,000/month" to 1250000
    return parseInt(salaryString.replace(/[₹,/month]/g, ''), 10) || 0;
  };

  // Apply filters and search whenever they change
  useEffect(() => {
    // Skip filtering if there are no candidates yet
    if (candidates.length === 0) return;

    let results = [...candidates];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(candidate =>
        candidate.name.toLowerCase().includes(query) ||
        (candidate.position && candidate.position.toLowerCase().includes(query)) ||
        (candidate.description && candidate.description.toLowerCase().includes(query)) ||
        (candidate.skills && candidate.skills.some(skill =>
          skill.toLowerCase().includes(query)
        )) ||
        candidate.email.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (activeFilters.skills && activeFilters.skills.length > 0) {
      results = results.filter(candidate =>
        candidate.skills && activeFilters.skills!.some(skill =>
          candidate.skills && candidate.skills.some(candidateSkill =>
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (activeFilters.experienceMin || activeFilters.experienceMax) {
      results = results.filter(candidate => {
        const exp = candidate.experience || 0;
        if (activeFilters.experienceMin && exp < activeFilters.experienceMin) {
          return false;
        }
        if (activeFilters.experienceMax && exp > activeFilters.experienceMax) {
          return false;
        }
        return true;
      });
    }

    if (activeFilters.salaryMin || activeFilters.salaryMax) {
      results = results.filter(candidate => {
        const candidateSalary = candidate.salary ? parseSalary(candidate.salary) : 0;
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
        candidate.country && activeFilters.countries!.includes(candidate.country)
      );
    }

    setFilteredCandidates(results);
  }, [searchQuery, activeFilters, candidates]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const handleApplyFilters = (filters: Filters) => {
    setActiveFilters(filters);
    setShowFilters(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-2" />
        <span className="text-lg text-gray-600">Loading students...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded flex items-center">
          <AlertCircle className="h-6 w-6 text-red-400 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

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
          </div>
        </form>

        <div className="flex justify-between items-center">
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
              id={candidate.uid}
              name={candidate.name}
              position={candidate.position || "Student"}
              experience={candidate.experience || 0}
              country={candidate.country || "Unknown"}
              countryFlag={candidate.countryFlag || "🌍"}
              skills={candidate.skills || []}
              salary={candidate.salary || "Not specified"}
              hourlyRate={candidate.hourlyRate || "Not specified"}
              verified={candidate.verified || false}
              description={candidate.description || ""}
              photo={candidate.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`}
              interviews={candidate.interviews}
            />
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No students match your current filters.</p>
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