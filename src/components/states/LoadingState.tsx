import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState = ({ 
  message = "Loading updates...", 
  size = 'md' 
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin mb-3`} />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};