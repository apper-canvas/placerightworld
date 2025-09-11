import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 3, ...props }) => {
  return (
    <div className={cn("animate-pulse space-y-4", className)} {...props}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg h-20 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] animate-[slide_1.5s_ease-in-out_infinite]"></div>
        </div>
      ))}
    </div>
  );
};

export default Loading;