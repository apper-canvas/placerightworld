import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-green-400 to-green-500 text-white",
    warning: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
    error: "bg-gradient-to-r from-red-400 to-red-500 text-white",
    info: "bg-gradient-to-r from-blue-400 to-blue-500 text-white",
    accent: "bg-gradient-to-r from-accent to-accent/90 text-white"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;