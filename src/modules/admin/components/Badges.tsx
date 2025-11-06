import React from "react";

interface StatusBadgeProps {
  status: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  variant?: "default" | "outlined";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  activeLabel = "Activo",
  inactiveLabel = "Inactivo",
  variant = "default",
}) => {
  const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
  
  const variantClasses = {
    default: status
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800",
    outlined: status
      ? "bg-white text-green-700 border border-green-300"
      : "bg-white text-red-700 border border-red-300",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {status ? activeLabel : inactiveLabel}
    </span>
  );
};

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const roleColors: Record<string, string> = {
    Admin: "bg-purple-100 text-purple-800",
    Empleado: "bg-blue-100 text-blue-800",
    Cliente: "bg-primary-100 text-primary-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        roleColors[role] || "bg-neutral-100 text-neutral-800"
      }`}
    >
      {role || "Sin rol"}
    </span>
  );
};

interface CategoryBadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  label,
  variant = "primary",
}) => {
  const variantClasses = {
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-neutral-100 text-neutral-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
};
