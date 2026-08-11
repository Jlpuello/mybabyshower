import { cn } from '../../utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const loadingSizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

export const Loading = ({ size = 'md', text, className }: LoadingProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-goldAccent border-t-transparent animate-spin',
          loadingSizes[size]
        )}
      />
      {text && (
        <p className="text-sm text-textSecondary animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Loading overlay para cubrir contenido
interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
}

export const LoadingOverlay = ({ isLoading, text }: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loading text={text} size="lg" />
    </div>
  );
};
