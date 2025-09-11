import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { useRole } from "@/hooks/useRole";

const JobCard = ({ job, onApply, onView, onEdit }) => {
  const { currentRole } = useRole();
  
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
          <p className="text-primary font-medium mb-2">{job.company}</p>
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
            {job.location}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={statusColors[job.status] || "default"}>
            {job.status}
          </Badge>
          <Badge variant={typeColors[job.type] || "default"}>
            {job.type}
          </Badge>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
          ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
        </div>
        <div className="flex items-center">
          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
          {format(new Date(job.postedDate), "MMM d, yyyy")}
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