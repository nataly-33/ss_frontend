import React from "react";
import { cn } from "@shared/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-secondary mb-2">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-3 bg-white border-2",
          "focus:outline-none transition-all duration-200",
          "text-text-primary font-medium placeholder:text-text-muted",
          "disabled:bg-neutral-light disabled:cursor-not-allowed disabled:opacity-50",
          error 
            ? "border-error focus:border-error focus:ring-2 focus:ring-error/20" 
            : "border-border hover:border-accent-mauve focus:border-accent-chocolate focus:ring-2 focus:ring-accent-chocolate/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-error font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  );
};
