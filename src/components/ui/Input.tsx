import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type, icon, label, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={`input-base ${icon ? 'pl-10' : 'pl-4'} ${className}`}
            ref={ref}
            {...props}
          />
        </div>
        {label && (
          <label className="absolute -top-2 left-2 px-1 text-xs text-gray-400 bg-transparent">
            {label}
          </label>
        )}
      </div>
    );
  }
); 