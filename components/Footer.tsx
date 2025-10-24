
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full max-w-6xl mx-auto py-4 px-4 md:px-8">
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                <p>&copy; {new Date().getFullYear()} Compressly. All Rights Reserved.</p>
            </div>
        </footer>
    );
};