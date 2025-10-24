
import React from 'react';
import { formatBytes } from '../utils/imageUtils';
import { DownloadIcon } from './icons';

interface DownloadButtonProps {
  imageDataUrl: string;
  originalFileName: string;
  compressedSize: number;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  imageDataUrl,
  originalFileName,
  compressedSize,
}) => {
  const getNewFileName = () => {
    const parts = originalFileName.split('.');
    parts.pop(); // Remove original extension
    const name = parts.join('.');
    
    // Extract mime type from data URL to determine the correct extension
    const mimeTypeMatch = imageDataUrl.match(/data:(image\/\w+);/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';

    let extension = 'jpg';
    switch (mimeType) {
      case 'image/png':
        extension = 'png';
        break;
      case 'image/jpeg':
        extension = 'jpg';
        break;
      case 'image/webp':
        extension = 'webp';
        break;
      default:
        // fallback to jpg for unknown types
        extension = 'jpg';
    }

    return `${name}-compressed.${extension}`;
  };

  return (
    <a
      href={imageDataUrl}
      download={getNewFileName()}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-900"
    >
        <DownloadIcon className="w-5 h-5"/>
        <span>Download Image</span>
        <span className="text-sm opacity-80">({formatBytes(compressedSize)})</span>
    </a>
  );
};
