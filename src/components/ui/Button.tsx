import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', fullWidth = false, ...props }, ref) => {
    return (
      <button
        className={`
          ${fullWidth ? 'w-full' : ''}
          px-6 py-3
          rounded-full
          font-medium
          transition-all
          ${variant === 'primary' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 
            'bg-transparent border border-white/20 text-white hover:bg-white/10'}
        `}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
); 