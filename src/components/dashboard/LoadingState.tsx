import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  className?: string;
}

export const LoadingState = ({ className = '' }: LoadingStateProps) => {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
};
