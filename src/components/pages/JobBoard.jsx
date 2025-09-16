import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import JobCard from "@/components/molecules/JobCard";
import { useRole } from "@/hooks/useRole";
import jobService from "@/services/api/jobService";
import applicationService from "@/services/api/applicationService";
import savedJobsService from "@/services/api/savedJobsService";
import { toast } from "react-toastify";

const JobBoard = () => {
  const { currentRole } = useRole();
const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    salaryMin: "",
    salaryMax: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const loadJobs = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await jobService.getAll();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadJobs();
  }, []);
  const handleSearch = (query) => {
    let filtered = jobs;
    
    if (query.trim()) {
      filtered = filtered.filter(job =>
job.title_c?.toLowerCase().includes(query.toLowerCase()) ||
        job.company_c?.toLowerCase().includes(query.toLowerCase()) ||
        job.description_c?.toLowerCase().includes(query.toLowerCase())
      );
    }

    applyFilters(filtered);
  };

  const applyFilters = (jobList = jobs) => {
    let filtered = [...jobList];

    if (filters.type) {
filtered = filtered.filter(job => job.type_c === filters.type);
    }

    if (filters.location) {
filtered = filtered.filter(job =>
        job.location_c?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.salaryMin) {
      filtered = filtered.filter(job => job.salaryRange.max >= parseInt(filters.salaryMin));
    }

    if (filters.salaryMax) {
      filtered = filtered.filter(job => job.salaryRange.min <= parseInt(filters.salaryMax));
    }

    setFilteredJobs(filtered);
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
      type: "",
      location: "",
      salaryMin: "",
      salaryMax: ""
    });
    setFilteredJobs(jobs);
  };

  const handleApply = async (job) => {
    if (currentRole !== "candidate") return;

    try {
      const newApplication = {
job_id_c: job.Id,
        candidate_id_c: 1, // Mock candidate ID
        status_c: "Applied",
        applied_date_c: new Date().toISOString(),
        cover_letter_c: "I am very interested in this position and believe my skills would be a great fit.",
        notes_c: "",
        interviews_c: ""
      };

      await applicationService.create(newApplication);
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit application");
    }
  };

  const handleView = (job) => {
toast.info(`Viewing details for ${job.title_c}`);
  };

  const handleEdit = (job) => {
toast.info(`Managing job posting: ${job.title_c}`);
  };

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadJobs} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentRole === "candidate" ? "Job Opportunities" : "Job Postings"}
          </h1>
          <p className="text-gray-600">
            {filteredJobs.length} {currentRole === "candidate" ? "opportunities" : "active postings"} available
          </p>
        </div>

        {currentRole === "recruiter" && (
          <Button>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search jobs, companies, or keywords..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
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
                  Min Salary
                </label>
                <input
                  type="number"
                  value={filters.salaryMin}
                  onChange={(e) => handleFilterChange("salaryMin", e.target.value)}
                  placeholder="50000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Salary
                </label>
                <input
                  type="number"
                  value={filters.salaryMax}
                  onChange={(e) => handleFilterChange("salaryMax", e.target.value)}
                  placeholder="150000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Listings */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-6">
{filteredJobs.map((job) => (
            <JobCard
              key={job.Id}
              job={job}
              onApply={handleApply}
              onView={handleView}
              onEdit={handleEdit}
              showSaveButton={true}
            />
          ))}
        </div>
      ) : (
        <Empty
          icon="Search"
          title="No jobs found"
          message="Try adjusting your search criteria or filters to find more opportunities."
          action={clearFilters}
          actionText="Clear Filters"
        />
      )}
    </div>
  );
};

export default JobBoard;