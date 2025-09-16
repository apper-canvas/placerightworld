import { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { useRole } from "@/hooks/useRole";
import savedJobsService from "@/services/api/savedJobsService";
import { toast } from "react-toastify";

const JobCard = ({ job, onApply, onView, onEdit, showSaveButton = true }) => {
  const { currentRole } = useRole();
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (currentRole === "candidate" && showSaveButton) {
        try {
          const saved = await savedJobsService.isSaved(job.Id);
          setIsSaved(saved);
        } catch (err) {
          console.error("Error checking saved status:", err);
        }
      }
    };

    checkSavedStatus();
  }, [job.Id, currentRole, showSaveButton]);

  const handleSaveToggle = async () => {
    if (savingJob) return;

    setSavingJob(true);
    try {
      const newSavedStatus = await savedJobsService.toggle(job.Id);
      setIsSaved(newSavedStatus);
      
      if (newSavedStatus) {
toast.success(`"${job.title_c}" saved for later`);
      } else {
        toast.info(`"${job.title_c}" removed from saved jobs`);
      }
    } catch (err) {
      toast.error("Failed to update saved job");
      console.error("Error toggling saved job:", err);
    } finally {
      setSavingJob(false);
    }
  };
  
  const statusColors = {
    "Active": "success",
    "Paused": "warning",
    "Closed": "default"
  };

  const typeColors = {
    "Full-time": "info",
    "Part-time": "accent",
    "Contract": "default",
    "Remote": "success"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
<h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title_c}</h3>
          <p className="text-primary font-medium mb-2">{job.company_c}</p>
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
{job.location_c}
          </div>
        </div>
<div className="flex items-center justify-between">
          <div className="flex gap-2">
<Badge variant={statusColors[job.status_c] || "default"}>
              {job.status_c}
            </Badge>
            <Badge variant={typeColors[job.type_c] || "default"}>
              {job.type_c}
            </Badge>
          </div>
          
          {/* Save Button for Candidates */}
          {currentRole === "candidate" && showSaveButton && (
            <Button
              variant="ghost"
              size="small"
              onClick={handleSaveToggle}
              disabled={savingJob}
              className="p-2 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <ApperIcon 
                name="Heart" 
                size={18} 
                className={isSaved ? "fill-current text-red-500" : "text-gray-400"}
              />
            </Button>
          )}
        </div>
      </div>

<p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description_c}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
{job.salary_range_c}
        </div>
        <div className="flex items-center">
          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
{format(new Date(job.posted_date_c), "MMM d, yyyy")}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Users" className="w-4 h-4 mr-1" />
          {job.applications.length} applications
        </div>
        
<div className="flex gap-2">
          <Button variant="outline" size="small" onClick={() => onView(job)}>
            View Details
          </Button>
          {currentRole === "candidate" && job.status === "Active" && (
            <Button size="small" onClick={() => onApply(job)}>
              Apply Now
            </Button>
          )}
          {currentRole === "recruiter" && (
            <Button variant="secondary" size="small" onClick={() => onEdit(job)}>
              Manage
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;