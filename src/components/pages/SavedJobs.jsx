import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import JobCard from "@/components/molecules/JobCard";
import savedJobsService from "@/services/api/savedJobsService";
import jobService from "@/services/api/jobService";
import { toast } from "react-toastify";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSavedJobs = async () => {
    try {
      setError("");
      setLoading(true);
      
      const savedJobIds = await savedJobsService.getAll();
      const jobPromises = savedJobIds.map(savedJob => 
        jobService.getById(savedJob.jobId)
      );
      
      const jobs = await Promise.all(jobPromises);
      const validJobs = jobs.filter(job => job !== null);
      
      setSavedJobs(validJobs);
    } catch (err) {
      setError("Failed to load saved jobs");
      console.error("Error loading saved jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const handleRemove = async (job) => {
    if (confirm(`Remove "${job.title}" from saved jobs?`)) {
      try {
        await savedJobsService.remove(job.Id);
        setSavedJobs(prev => prev.filter(j => j.Id !== job.Id));
        toast.success(`"${job.title}" removed from saved jobs`);
      } catch (err) {
        toast.error("Failed to remove job from saved jobs");
        console.error("Error removing saved job:", err);
      }
    }
  };

  const handleApply = (job) => {
    toast.success(`Applied to ${job.title}`);
  };

  const handleView = (job) => {
    toast.info(`Viewing details for ${job.title}`);
  };

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadSavedJobs} />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name="Heart" size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
            <p className="text-gray-600">
              Jobs you've saved for later consideration
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ApperIcon name="Bookmark" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{savedJobs.length}</p>
              <p className="text-sm text-gray-500">Saved Jobs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {savedJobs.filter(job => job.status === "Active").length}
              </p>
              <p className="text-sm text-gray-500">Active Jobs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <ApperIcon name="Building" size={20} className="text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(savedJobs.map(job => job.company)).size}
              </p>
              <p className="text-sm text-gray-500">Companies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      {savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savedJobs.map((job) => (
            <div key={job.Id} className="relative">
              <JobCard
                job={job}
                onApply={handleApply}
                onView={handleView}
                onEdit={() => {}}
                showSaveButton={false}
              />
              
              {/* Custom Remove Button Overlay */}
              <div className="absolute top-4 right-4">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleRemove(job)}
                  className="bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                >
                  <ApperIcon name="X" size={16} />
                  <span className="ml-1 hidden sm:inline">Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          title="No Saved Jobs"
          description="You haven't saved any jobs yet. Browse the job board to save jobs that interest you."
          actionLabel="Browse Jobs"
          onAction={() => window.location.href = '/jobs'}
        />
      )}
    </div>
  );
};

export default SavedJobs;