import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ text = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  const spinnerSize = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${spinnerSize[size]} animate-spin rounded-full border-4 border-purple-200 border-t-purple-600`} />
      {text && (
        <p className="text-gray-600 text-sm animate-pulse">{text}</p>
      )}
    </div>
  );
}