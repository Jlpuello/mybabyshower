import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: 'bg-goldAccent text-textPrimary hover:bg-goldLight transition-colors',
  secondary: 'bg-warmBeige text-textPrimary hover:bg-cream transition-colors',
  outline: 'border-2 border-goldAccent text-textPrimary hover:bg-goldLight/10 transition-colors',
  ghost: 'text-textPrimary hover:bg-warmBeige/50 transition-colors',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-goldAccent focus:ring-offset-2',
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
