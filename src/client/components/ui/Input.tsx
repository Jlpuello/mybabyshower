import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-textSecondary mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2 rounded-lg border border-warmBeige bg-white',
            'text-textPrimary placeholder:text-textLight',
            'focus:outline-none focus:ring-2 focus:ring-goldAccent focus:border-transparent',
            'transition-colors',
            error && 'border-error focus:ring-error',
            disabled && 'opacity-50 cursor-not-allowed bg-offWhite',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
