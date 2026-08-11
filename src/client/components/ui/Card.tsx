import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  variant?: 'default' | 'elevated' | 'flat';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const cardVariants = {
  default: 'border border-warmBeige bg-white shadow-soft',
  elevated: 'border border-warmBeige bg-white shadow-softLg',
  flat: 'border border-warmBeige bg-white shadow-none',
};

const cardPadding = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg',
          cardVariants[variant],
          cardPadding[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
