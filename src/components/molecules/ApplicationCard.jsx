import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { useRole } from "@/hooks/useRole";

const ApplicationCard = ({ application, job, candidate, onView, onUpdateStatus }) => {
  const { currentRole } = useRole();

  const statusColors = {
    "Applied": "info",
    "Reviewing": "warning",
    "Interview": "accent",
    "Offer": "success",
    "Rejected": "error",
    "Accepted": "success"
  };

  const statusIcons = {
    "Applied": "FileText",
    "Reviewing": "Eye",
    "Interview": "Users",
    "Offer": "Gift",
    "Rejected": "X",
    "Accepted": "Check"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
{currentRole === "candidate" ? job?.title_c : candidate?.name_c}
          </h3>
          <p className="text-primary font-medium mb-2">
{currentRole === "candidate" ? job?.company_c : job?.title_c}
          </p>
          <div className="flex items-center text-gray-600 text-sm">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
Applied {format(new Date(application.applied_date_c), "MMM d, yyyy")}
          </div>
        </div>
<Badge variant={statusColors[application.status_c] || "default"}>
          <ApperIcon name={statusIcons[application.status_c]} className="w-3 h-3 mr-1" />
          {application.status_c}
        </Badge>
      </div>

{application.cover_letter_c && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
          <p className="text-sm text-gray-600 line-clamp-3">{application.cover_letter_c}</p>
        </div>
      )}

{application.notes_c && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
          <p className="text-sm text-gray-600">{application.notes_c}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
{application.interviews_c ? 1 : 0} interviews scheduled
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="small" onClick={() => onView(application)}>
            View Details
          </Button>
{currentRole === "recruiter" && application.status_c === "Applied" && (
            <Button size="small" onClick={() => onUpdateStatus(application.Id, "Reviewing")}>
              Start Review
            </Button>
          )}
          {currentRole === "recruiter" && application.status_c === "Reviewing" && (
            <Button variant="accent" size="small" onClick={() => onUpdateStatus(application.Id, "Interview")}>
              Schedule Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;