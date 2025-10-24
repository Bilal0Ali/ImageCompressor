import React from 'react';
import type { ImageInfo, CompressionStatus } from '../types';
import { formatBytes } from '../utils/imageUtils';

interface ImagePreviewProps {
  originalImage: ImageInfo;
  compressedImage: ImageInfo | null;
  status: CompressionStatus;
}

const PreviewCard: React.FC<{ title: string; image: ImageInfo, isOriginal?: boolean }> = ({ title, image, isOriginal = false }) => (
    <div className="flex flex-col space-y-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white text-center">{title}</h3>
        <div className="aspect-w-16 aspect-h-9 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
            {image.src ? (
                <img src={image.src} alt={title} className="object-contain max-h-full max-w-full" />
            ) : (
                <div className="flex flex-col items-center text-slate-400 dark:text-slate-500 p-4">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   <p className="mt-2 text-sm">{isOriginal ? 'Original Image' : 'Compressed Result'}</p>
                </div>
            )}
        </div>
        <div className="text-center text-sm font-medium text-slate-600 dark:text-slate-300 min-h-[1.25rem]">
            {image.size !== null ? formatBytes(image.size) : ''}
        </div>
    </div>
);


export const ImagePreview: React.FC<ImagePreviewProps> = ({ originalImage, compressedImage, status }) => {
    
    const savings = originalImage.size && compressedImage?.size 
        ? ((originalImage.size - compressedImage.size) / originalImage.size) * 100
        : 0;

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PreviewCard title="Original" image={originalImage} isOriginal={true}/>
            <PreviewCard title="Compressed" image={compressedImage || { src: null, size: null }} />
        </div>
        {status === 'success' && compressedImage && savings > 0 && (
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="font-semibold text-green-800 dark:text-green-300">
                    Compression successful! File size reduced by {savings.toFixed(1)}%.
                </p>
            </div>
        )}
    </div>
  );
};