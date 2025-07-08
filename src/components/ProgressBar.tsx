import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'from-gray-300 to-gray-400';
    if (progress < 25) return 'from-red-400 to-red-500';
    if (progress < 50) return 'from-orange-400 to-orange-500';
    if (progress < 75) return 'from-yellow-400 to-yellow-500';
    if (progress < 100) return 'from-blue-400 to-blue-500';
    return 'from-green-400 to-green-500';
  };

  const getProgressText = (progress: number) => {
    if (progress === 0) return 'Get started by filling out the form';
    if (progress < 25) return 'Just getting started...';
    if (progress < 50) return 'Making good progress!';
    if (progress < 75) return 'Almost halfway there!';
    if (progress < 100) return 'You\'re almost done!';
    return 'Ready to submit!';
  };

  return (
    <div className="w-full mb-6 sm:mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs sm:text-sm font-medium text-gray-600">
          Form Completion
        </span>
        <span className="text-xs sm:text-sm font-bold text-brand-primary">
          {progress}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div 
          className={`bg-gradient-to-r ${getProgressColor(progress)} h-3 rounded-full transition-all duration-500 ease-out relative`}
          style={{ width: `${progress}%` }}
        >
          {progress > 0 && (
            <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse rounded-full"></div>
          )}
        </div>
      </div>
      
      <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
        {getProgressText(progress)}
      </p>
    </div>
  );
};