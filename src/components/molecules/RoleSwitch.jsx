import ApperIcon from "@/components/ApperIcon";
import { useRole } from "@/hooks/useRole";

const RoleSwitch = () => {
  const { currentRole, toggleRole } = useRole();

  return (
    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
      <button
        onClick={toggleRole}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentRole === "candidate"
            ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <ApperIcon name="User" className="w-4 h-4 mr-2" />
        Candidate
      </button>
      <button
        onClick={toggleRole}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentRole === "recruiter"
            ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <ApperIcon name="Building2" className="w-4 h-4 mr-2" />
        Recruiter
      </button>
    </div>
  );
};

export default RoleSwitch;