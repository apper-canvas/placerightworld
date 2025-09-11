import ApperIcon from "@/components/ApperIcon";
import RoleSwitch from "@/components/molecules/RoleSwitch";
import { useRole } from "@/hooks/useRole";

const Header = () => {
  const { currentRole } = useRole();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <ApperIcon name="Briefcase" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">PlaceRight</h1>
            <p className="text-sm text-gray-600 capitalize">
              {currentRole === "candidate" ? "Find Your Next Opportunity" : "Find Top Talent"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <RoleSwitch />
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="Bell" className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="Settings" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;