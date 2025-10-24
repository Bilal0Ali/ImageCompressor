
import React from 'react';
import type { TargetUnit } from '../types';
import { formatBytes } from '../utils/imageUtils';

interface ControlsProps {
  targetSize: number;
  setTargetSize: (size: number) => void;
  targetUnit: TargetUnit;
  setTargetUnit: (unit: TargetUnit) => void;
  onCompress: () => void;
  isCompressing: boolean;
  originalSize: number | null;
}

export const Controls: React.FC<ControlsProps> = ({
  targetSize,
  setTargetSize,
  targetUnit,
  setTargetUnit,
  onCompress,
  isCompressing,
  originalSize,
}) => {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col space-y-1">
            <label htmlFor="target-size" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Target File Size
            </label>
            <div className="flex items-center">
                <input
                    id="target-size"
                    type="number"
                    value={targetSize}
                    onChange={(e) => setTargetSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                    min="1"
                />
                <select
                    value={targetUnit}
                    onChange={(e) => setTargetUnit(e.target.value as TargetUnit)}
                    className="px-3 py-2 border-t border-r border-b border-slate-300 dark:border-slate-600 rounded-r-md bg-slate-50 dark:bg-slate-600 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                >
                    <option>KB</option>
                    <option>MB</option>
                </select>
            </div>
        </div>

        {originalSize !== null && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
                Original size: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatBytes(originalSize)}</span>
            </div>
        )}
        
        <button
            onClick={onCompress}
            disabled={isCompressing}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
        >
            {isCompressing ? (
                 <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Compressing...
                 </>
            ) : 'Compress Image'}
        </button>
    </div>
  );
};
