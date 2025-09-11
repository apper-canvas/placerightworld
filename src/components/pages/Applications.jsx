import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import ApplicationCard from "@/components/molecules/ApplicationCard";
import { useRole } from "@/hooks/useRole";
import applicationService from "@/services/api/applicationService";
import jobService from "@/services/api/jobService";
import candidateService from "@/services/api/candidateService";
import { toast } from "react-toastify";

const Applications = () => {
  const { currentRole } = useRole();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadApplications = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [applicationsData, jobsData, candidatesData] = await Promise.all([
        applicationService.getAll(),
        jobService.getAll(),
        candidateService.getAll()
      ]);

      setApplications(applicationsData);
      setJobs(jobsData);
      setCandidates(candidatesData);
    } catch (err) {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const application = applications.find(app => app.Id === applicationId);
      if (!application) return;

      const updatedApplication = {
        ...application,
        status: newStatus
      };

      await applicationService.update(applicationId, updatedApplication);
      
      setApplications(prev =>
        prev.map(app => 
          app.Id === applicationId ? updatedApplication : app
        )
      );

      toast.success(`Application status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update application status");
    }
  };

  const handleView = (application) => {
    toast.info("Opening application details");
  };

  const getJobById = (jobId) => jobs.find(job => job.Id === parseInt(jobId));
  const getCandidateById = (candidateId) => candidates.find(candidate => candidate.Id === parseInt(candidateId));

  const filteredApplications = applications.filter(app => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  });

  const statusCounts = {
    all: applications.length,
    Applied: applications.filter(app => app.status === "Applied").length,
    Reviewing: applications.filter(app => app.status === "Reviewing").length,
    Interview: applications.filter(app => app.status === "Interview").length,
    Offer: applications.filter(app => app.status === "Offer").length,
    Rejected: applications.filter(app => app.status === "Rejected").length,
    Accepted: applications.filter(app => app.status === "Accepted").length
  };

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadApplications} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentRole === "candidate" ? "My Applications" : "Application Management"}
          </h1>
          <p className="text-gray-600">
            {filteredApplications.length} applications {statusFilter !== "all" ? `with status: ${statusFilter}` : "total"}
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === status
                  ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100 hover:text-primary"
              }`}
            >
              <span className="capitalize">{status === "all" ? "All" : status}</span>
              <Badge variant={statusFilter === status ? "default" : "default"}>
                {count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="grid gap-6">
          {filteredApplications.map((application) => {
            const job = getJobById(application.jobId);
            const candidate = getCandidateById(application.candidateId);
            
            return (
              <ApplicationCard
                key={application.Id}
                application={application}
                job={job}
                candidate={candidate}
                onView={handleView}
                onUpdateStatus={handleUpdateStatus}
              />
            );
          })}
        </div>
      ) : (
        <Empty
          icon="FileText"
          title="No applications found"
          message={
            statusFilter === "all" 
              ? currentRole === "candidate" 
                ? "You haven't submitted any applications yet. Start by browsing available jobs."
                : "No applications have been received yet."
              : `No applications with status "${statusFilter}" found.`
          }
          action={() => setStatusFilter("all")}
          actionText={statusFilter !== "all" ? "Show All Applications" : "Browse Jobs"}
        />
      )}

      {/* Application Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {currentRole === "candidate" ? "Application Overview" : "Application Statistics"}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => {
            if (status === "all") return null;
            
            return (
              <div key={status} className="text-center p-4 rounded-lg bg-gray-50">
                <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Applications;