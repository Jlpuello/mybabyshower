import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ icon: Icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {Icon && (
        <div className="mb-4 text-textLight">
          <Icon className="w-16 h-16 mx-auto" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-xl font-serif font-semibold text-textPrimary mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-textSecondary max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};
