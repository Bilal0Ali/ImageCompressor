
import React from 'react';
import { SparklesIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-8 h-8 text-indigo-500" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
              IntelliCompress
            </h1>
          </div>
          <p className="hidden md:block text-sm text-slate-500 dark:text-slate-400">AI-Powered Image Sizer</p>
        </div>
      </div>
    </header>
  );
};
