import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import CandidateCard from "@/components/molecules/CandidateCard";
import { useRole } from "@/hooks/useRole";
import candidateService from "@/services/api/candidateService";
import savedCandidatesService from "@/services/api/savedCandidatesService";
import { toast } from "react-toastify";

const Candidates = () => {
  const { currentRole } = useRole();
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    skills: "",
    location: "",
    experience: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const loadCandidates = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await candidateService.getAll();
      setCandidates(data);
      setFilteredCandidates(data);
    } catch (err) {
      setError("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleSearch = (query) => {
    let filtered = candidates;
    
    if (query.trim()) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(query.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
        candidate.experience.some(exp => 
          exp.position.toLowerCase().includes(query.toLowerCase()) ||
          exp.company.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    applyFilters(filtered);
  };

  const applyFilters = (candidateList = candidates) => {
    let filtered = [...candidateList];

    if (filters.skills) {
      filtered = filtered.filter(candidate =>
        candidate.skills.some(skill =>
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        )
      );
    }

    if (filters.location) {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.experience) {
      const minYears = parseInt(filters.experience);
      if (!isNaN(minYears)) {
        filtered = filtered.filter(candidate => {
          const totalExperience = candidate.experience.reduce((total, exp) => {
            return total + (exp.duration || 1);
          }, 0);
          return totalExperience >= minYears;
        });
      }
    }

    setFilteredCandidates(filtered);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    setTimeout(() => {
      applyFilters();
    }, 0);
  };

  const clearFilters = () => {
    setFilters({
      skills: "",
      location: "",
      experience: ""
    });
    setFilteredCandidates(candidates);
  };

const handleSave = async (candidate, isSaved) => {
    // Save/unsave handling is done in CandidateCard component
    console.log(`Candidate ${candidate.name} ${isSaved ? 'saved' : 'removed'}`);
  };

  const handleView = (candidate) => {
    toast.info(`Viewing profile for ${candidate.name}`);
  };

  const handleMessage = (candidate) => {
    toast.success(`Starting conversation with ${candidate.name}`);
  };

  const handleInvite = (candidate) => {
    toast.success(`Invitation sent to ${candidate.name}`);
  };

  // Redirect if not recruiter
  if (currentRole !== "recruiter") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ApperIcon name="Lock" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Recruiter Access Only</h2>
          <p className="text-gray-600">
            Switch to recruiter mode to view and search candidates.
          </p>
        </div>
      </div>
    );
  }

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadCandidates} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Database</h1>
          <p className="text-gray-600">
            {filteredCandidates.length} qualified candidates available
          </p>
        </div>

        <Button>
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Invite Candidate
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search candidates by name, skills, or experience..."
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ApperIcon name="Filter" className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {Object.values(filters).some(f => f) && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <input
                  type="text"
                  value={filters.skills}
                  onChange={(e) => handleFilterChange("skills", e.target.value)}
                  placeholder="React, JavaScript, Python..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  placeholder="City, State, or Remote"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Experience (years)
                </label>
                <input
                  type="number"
                  value={filters.experience}
                  onChange={(e) => handleFilterChange("experience", e.target.value)}
                  placeholder="3"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>
      </div>

{/* Candidate Listings */}
      {filteredCandidates.length > 0 ? (
        <div className="grid gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.Id}
              candidate={candidate}
              onView={handleView}
              onMessage={handleMessage}
              onInvite={handleInvite}
              onSave={handleSave}
            />
          ))}
        </div>
      ) : (
        <Empty
          icon="Users"
          title="No candidates found"
          message="Try adjusting your search criteria or filters to find more qualified candidates."
          action={clearFilters}
          actionText="Clear Filters"
        />
      )}
    </div>
  );
};

export default Candidates;