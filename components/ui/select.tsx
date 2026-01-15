"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, placeholder, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full rounded-full border border-[#d1d5db] bg-white px-4 py-2 text-sm text-[#374151] shadow-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "appearance-none pr-10",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-[#6b7280]"
          aria-hidden="true"
        />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };

