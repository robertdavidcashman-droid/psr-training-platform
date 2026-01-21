import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "gradient";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, showLabel = false, variant = "default", ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    const variantClasses = {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      gradient: "progress-gradient",
    };

    return (
      <div className="w-full">
        <div
          ref={ref}
          className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "h-full transition-all duration-300 ease-in-out rounded-full",
              variantClasses[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <span className="mt-1 text-sm text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
