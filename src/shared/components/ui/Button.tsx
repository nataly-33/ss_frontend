import React from "react";
import { cn } from "@shared/utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-accent-chocolate text-white hover:bg-accent-chocolateHover hover:shadow-lg hover:scale-105 active:scale-100",
    secondary: 
      "bg-accent-mauve text-white hover:bg-accent-chocolate hover:shadow-lg hover:scale-105 active:scale-100",
    outline: 
      "border-2 border-accent-chocolate text-accent-chocolate hover:bg-accent-chocolate hover:text-white hover:shadow-lg",
    ghost: 
      "text-text-secondary hover:bg-primary-light hover:text-accent-chocolate",
    danger:
      "bg-error text-white hover:bg-error/90 hover:shadow-lg hover:scale-105 active:scale-100",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </button>
  );
};
