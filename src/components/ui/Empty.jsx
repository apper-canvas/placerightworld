import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className,
  icon = "FileText",
  title = "No items found",
  message = "Get started by adding your first item.",
  action,
  actionText = "Add Item",
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)} {...props}>
      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <ApperIcon name={icon} className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{message}</p>
      {action && (
        <button
          onClick={action}
          className="px-8 py-3 bg-gradient-to-r from-accent to-accent/90 text-white rounded-lg hover:from-accent/90 hover:to-accent hover:scale-105 transition-all duration-200 font-medium shadow-lg"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default Empty;