import React from 'react';
import { SparklesIcon, MoonIcon, SunIcon } from './icons';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-8 h-8 text-indigo-500" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
              Compressly
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};