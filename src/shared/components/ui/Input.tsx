import React from "react";
import { cn } from "@shared/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2.5 rounded-lg border border-neutral-300",
          "focus:border-primary-500 focus:ring-2 focus:ring-primary-100",
          "transition-colors duration-200",
          "placeholder:text-neutral-400",
          error && "border-red-500 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
