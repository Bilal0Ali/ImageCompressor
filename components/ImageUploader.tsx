import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const dragDropClasses = isDragging 
    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
    : 'border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/20';

  return (
    <div
      className="flex flex-col items-center justify-center p-8 md:p-16 border-2 border-dashed rounded-xl transition-all duration-300 text-center cursor-pointer min-h-[350px] md:min-h-[400px]"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
    >
      <div className={`w-full h-full flex flex-col items-center justify-center p-8 rounded-lg transition-colors ${dragDropClasses}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <UploadIcon className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
          Drag & Drop your image here
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          or <span className="font-semibold text-indigo-500">click to browse</span>
        </p>
         <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
          Supports JPEG, PNG, WEBP, and more.
        </p>
      </div>
    </div>
  );
};