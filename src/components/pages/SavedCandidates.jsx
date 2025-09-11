import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import CandidateCard from "@/components/molecules/CandidateCard";
import savedCandidatesService from "@/services/api/savedCandidatesService";
import candidateService from "@/services/api/candidateService";
import { toast } from "react-toastify";

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    experience: "",
    location: "",
    skills: ""
  });

  useEffect(() => {
    loadSavedCandidates();
  }, []);

  const loadSavedCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const savedCandidateIds = await savedCandidatesService.getAll();
      
      // Get full candidate details for each saved candidate
      const candidatePromises = savedCandidateIds.map(async (savedItem) => {
        const candidate = await candidateService.getById(savedItem.candidateId);
        return {
          ...candidate,
          savedAt: savedItem.savedAt,
          savedId: savedItem.Id
        };
      });
      
      const candidates = await Promise.all(candidatePromises);
      setSavedCandidates(candidates.filter(Boolean)); // Filter out any null results
    } catch (err) {
      console.error("Error loading saved candidates:", err);
      setError(err.message || "Failed to load saved candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      experience: "",
      location: "",
      skills: ""
    });
    setSearchQuery("");
  };

  const applyFilters = (candidateList = savedCandidates) => {
    return candidateList.filter(candidate => {
      const matchesSearch = !searchQuery || 
        candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.company?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExperience = !filters.experience || 
        candidate.experience?.toString().includes(filters.experience);

      const matchesLocation = !filters.location || 
        candidate.location?.toLowerCase().includes(filters.location.toLowerCase());

      const matchesSkills = !filters.skills ||
        candidate.skills?.some(skill => 
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        );

      return matchesSearch && matchesExperience && matchesLocation && matchesSkills;
    });
  };

  const filteredCandidates = applyFilters();

  const handleRemove = async (candidate) => {
    if (!confirm(`Remove ${candidate.name} from your saved candidates?`)) {
      return;
    }

    try {
      await savedCandidatesService.remove(candidate.Id);
      setSavedCandidates(prev => prev.filter(c => c.Id !== candidate.Id));
      toast.success("Candidate removed from saved list");
    } catch (error) {
      console.error("Error removing candidate:", error);
      toast.error("Failed to remove candidate");
    }
  };

  const handleView = (candidate) => {
    console.log("Viewing candidate:", candidate);
    // Implement candidate detail view navigation
  };

  const handleMessage = (candidate) => {
    console.log("Messaging candidate:", candidate);
    toast.info(`Opening message thread with ${candidate.name}`);
  };

  const handleInvite = (candidate) => {
    console.log("Inviting candidate:", candidate);
    toast.success(`Interview invitation sent to ${candidate.name}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSavedCandidates} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Candidates</h1>
          <p className="text-gray-600">
            Manage your saved candidate profiles ({savedCandidates.length} saved)
          </p>
        </div>
        
        {savedCandidates.length > 0 && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <ApperIcon name="RotateCcw" size={16} />
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      {savedCandidates.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <SearchBar
                placeholder="Search saved candidates..."
                onSearch={handleSearch}
                value={searchQuery}
              />
            </div>
            
            <select
              value={filters.experience}
              onChange={(e) => handleFilterChange("experience", e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">All Experience Levels</option>
              <option value="0">Entry Level (0-2 years)</option>
              <option value="3">Mid Level (3-5 years)</option>
              <option value="6">Senior Level (6+ years)</option>
            </select>
            
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">All Locations</option>
              <option value="New York">New York</option>
              <option value="San Francisco">San Francisco</option>
              <option value="London">London</option>
              <option value="Berlin">Berlin</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Active Filters */}
          {(searchQuery || Object.values(filters).some(Boolean)) && (
            <div className="flex items-center gap-2 mt-4 text-sm">
              <span className="text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Search: "{searchQuery}"
                </span>
              )}
              {Object.entries(filters).map(([key, value]) => 
                value && (
                  <span key={key} className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {key}: {value}
                  </span>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      {savedCandidates.length > 0 && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="text-gray-600">
            {filteredCandidates.length === savedCandidates.length
              ? `${savedCandidates.length} saved candidate${savedCandidates.length !== 1 ? 's' : ''}`
              : `${filteredCandidates.length} of ${savedCandidates.length} saved candidates`
            }
          </div>
          <div className="text-sm text-gray-500">
            Sorted by recently saved
          </div>
        </div>
      )}

      {/* Candidate Listings */}
      {filteredCandidates.length > 0 ? (
        <div className="grid gap-6">
          {filteredCandidates.map((candidate) => (
            <div key={candidate.Id} className="relative">
              <CandidateCard
                candidate={candidate}
                onView={handleView}
                onMessage={handleMessage}
                onInvite={handleInvite}
                showSaveButton={false}
              />
              
              {/* Remove Button */}
              <Button
                variant="outline"
                size="small"
                onClick={() => handleRemove(candidate)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                <ApperIcon name="X" size={16} />
              </Button>
              
              {/* Saved Date */}
              <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
                Saved {new Date(candidate.savedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : savedCandidates.length > 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates match your filters</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <Button onClick={clearFilters} variant="outline">
            Clear all filters
          </Button>
        </div>
      ) : (
        <Empty
          icon="Heart"
          title="No saved candidates yet"
          message="Start building your talent pool by saving interesting candidate profiles. You'll find them here for easy access later."
          actionText="Browse Candidates"
          action={() => window.location.href = '/candidates'}
        />
      )}
    </div>
  );
};

export default SavedCandidates;