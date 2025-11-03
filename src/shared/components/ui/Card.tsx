import React from "react";
import { cn } from "@shared/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm overflow-hidden",
        hover &&
          "transition-all duration-300 hover:shadow-md hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
};
