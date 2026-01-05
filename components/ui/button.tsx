import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
      variants: {
        variant: {
          // Primary - Dark navy blue like psrtrain.com Sign in button
        default: "bg-[#1e3a5f] text-white hover:bg-[#2d4a6f] rounded-full shadow-sm",
        
        // Navy - Alias for default (dark navy blue)
        navy: "bg-[#1e3a5f] text-white hover:bg-[#2d4a6f] rounded-full shadow-sm",
        
        // Destructive - Red
        destructive: "bg-[#ef4444] text-white hover:bg-[#dc2626] rounded-full",
        
        // Outline - White with gray border like Google button
        outline: "border border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f9fafb] hover:border-[#9ca3af] rounded-full",
        
        // Secondary - Light gray background
        secondary: "bg-[#f3f4f6] text-[#1f2937] hover:bg-[#e5e7eb] rounded-full",
        
        // Ghost - No background, hover shows gray
        ghost: "hover:bg-[#f3f4f6] text-[#6b7280] hover:text-[#1f2937] rounded-lg",
        
        // Link - Blue text with underline on hover
        link: "text-[#3b82f6] underline-offset-4 hover:underline",
        
        // Google OAuth button style
        google: "border border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f9fafb] rounded-full shadow-sm",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
