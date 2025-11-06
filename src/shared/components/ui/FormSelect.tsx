import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  options,
  placeholder = 'Seleccionar...',
  className = '',
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
      <select
        className={`
          w-full px-4 py-3 
          bg-white border-2 
          ${error ? 'border-error' : 'border-border hover:border-accent-mauve'} 
          focus:border-accent-chocolate focus:ring-2 focus:ring-accent-chocolate/20
          text-text-primary font-medium
          transition-all duration-200
          disabled:bg-neutral-light disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
};
