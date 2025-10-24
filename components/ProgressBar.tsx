
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const messages: { [key: number]: string } = {
    10: "Initializing compression...",
    30: "Analyzing image dimensions...",
    60: "Querying AI for optimal settings...",
    90: "Applying compression parameters...",
    100: "Finalizing...",
  };

  const currentMessage = 
    progress >= 100 ? messages[100] :
    progress >= 90 ? messages[90] :
    progress >= 60 ? messages[60] :
    progress >= 30 ? messages[30] :
    messages[10];

  return (
    <div className="space-y-2">
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-center text-slate-600 dark:text-slate-400">{currentMessage}</p>
    </div>
  );
};
