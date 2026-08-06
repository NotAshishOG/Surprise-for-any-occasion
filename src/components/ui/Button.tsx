import * as React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center brutalist-button px-6 py-3 text-lg";
    
    const variants = {
      primary: "bg-[#FFD166] text-[#1A1A1A] hover:bg-[#F5B726]",
      secondary: "bg-white text-[#1A1A1A] hover:bg-gray-100",
      ghost: "bg-transparent text-[#1A1A1A] hover:bg-gray-200 border-none shadow-none active:translate-x-0 active:translate-y-0"
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        disabled={disabled || isLoading}
        onPointerDown={(e) => {
          import("@/lib/audio").then(({ audio }) => audio.playClick());
          props.onPointerDown?.(e);
        }}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
