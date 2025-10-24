import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { Controls } from './components/Controls';
import { ImagePreview } from './components/ImagePreview';
import { ProgressBar } from './components/ProgressBar';
import { DownloadButton } from './components/DownloadButton';
import { Alert } from './components/Alert';
import type { CompressionStatus, TargetUnit } from './types';
import { fileToBase64, dataUrlToBlob, getImageDimensions } from './utils/imageUtils';
import { getCompressionParams } from './services/geminiService';

const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
    const [originalImageSize, setOriginalImageSize] = useState<number | null>(null);

    const [compressedImagePreview, setCompressedImagePreview] = useState<string | null>(null);
    const [compressedImageSize, setCompressedImageSize] = useState<number | null>(null);

    const [targetSize, setTargetSize] = useState<number>(500);
    const [targetUnit, setTargetUnit] = useState<TargetUnit>('KB');

    const [status, setStatus] = useState<CompressionStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) {
            return 'dark';
        }
        return 'light';
    });

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const targetSizeInBytes = useMemo(() => {
        const size = targetSize || 0;
        return targetUnit === 'MB' ? size * 1024 * 1024 : size * 1024;
    }, [targetSize, targetUnit]);

    const handleImageUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file (JPEG, PNG, WEBP, etc.).');
            setStatus('error');
            return;
        }
        
        // Reset state for new upload
        setOriginalImage(file);
        setOriginalImageSize(file.size);
        setCompressedImagePreview(null);
        setCompressedImageSize(null);
        setStatus('idle');
        setError(null);
        setProgress(0);
        
        try {
            const dataUrl = await fileToBase64(file);
            setOriginalImagePreview(dataUrl);
        } catch (err) {
            setError('Could not read the image file.');
            setStatus('error');
        }
    }, []);

    const compressImageWithParams = useCallback(async (imageSrc: string, quality: number, newWidth: number | null, mimeType: string) => {
        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        let { width, height } = image;
        if (newWidth && newWidth < width) {
            const aspectRatio = height / width;
            width = newWidth;
            height = newWidth * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        const blob = dataUrlToBlob(compressedDataUrl);

        return { dataUrl: compressedDataUrl, size: blob.size };
    }, []);

    const handleCompress = useCallback(async () => {
        if (!originalImage || !originalImagePreview || !originalImageSize) {
            setError('Please upload an image first.');
            setStatus('error');
            return;
        }

        if (targetSizeInBytes <= 0) {
            setError('Target size must be greater than 0.');
            setStatus('error');
            return;
        }

        if (targetSizeInBytes >= originalImageSize) {
             setError('Target size must be smaller than the original image size.');
             setStatus('error');
             return;
        }

        setStatus('compressing');
        setError(null);
        setProgress(10);

        const outputMimeType = originalImage.type === 'image/png' ? 'image/jpeg' : originalImage.type;

        try {
            const { width, height } = await getImageDimensions(originalImagePreview);
            setProgress(30);

            const params = await getCompressionParams(originalImageSize, width, height, targetSizeInBytes, outputMimeType);
            setProgress(60);

            // High-precision binary search for the best quality setting
            let lowerBound = 0.01;
            let upperBound = 1.0;
            let bestResult = { dataUrl: '', size: Infinity }; // Closest result found
            let finalResult = { dataUrl: '', size: 0 }; // Best result under target size

            const MAX_ITERATIONS = 8; // Sufficient for high precision

            for (let i = 0; i < MAX_ITERATIONS; i++) {
                const currentQuality = (lowerBound + upperBound) / 2;
                const result = await compressImageWithParams(originalImagePreview, currentQuality, params.newWidth, outputMimeType);

                if (Math.abs(result.size - targetSizeInBytes) < Math.abs(bestResult.size - targetSizeInBytes)) {
                    bestResult = result;
                }

                if (result.size <= targetSizeInBytes) {
                    if (result.size > finalResult.size) {
                        finalResult = result;
                    }
                    lowerBound = currentQuality; // Try for higher quality
                } else {
                    upperBound = currentQuality; // Quality is too high
                }
            }

            // Prioritize the best result that is under the target size.
            // Fall back to the absolute closest result if no image under the target was generated.
            const chosenResult = finalResult.dataUrl ? finalResult : bestResult;
            setProgress(90);
            
            if (chosenResult.size >= originalImageSize) {
                setError("Compression resulted in a larger file. Please try a lower target size or a different image.");
                setStatus('error');
                setProgress(0);
                setCompressedImagePreview(null);
                setCompressedImageSize(null);
                return;
            }

            setCompressedImagePreview(chosenResult.dataUrl);
            setCompressedImageSize(chosenResult.size);
            setProgress(100);
            setStatus('success');

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during compression.';
            console.error(err);
            setError(`Compression failed: ${errorMessage}`);
            setStatus('error');
            setProgress(0);
        }
    }, [originalImage, originalImagePreview, originalImageSize, targetSizeInBytes, compressImageWithParams]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-grow w-full max-w-6xl mx-auto p-4 md:p-8">
                <div className="space-y-8">
                    {!originalImage && (
                        <ImageUploader onImageUpload={handleImageUpload} />
                    )}

                    {originalImage && (
                        <>
                            {error && <Alert message={error} onClose={() => setError(null)} />}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1 space-y-6">
                                     <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
                                    <Controls
                                        targetSize={targetSize}
                                        setTargetSize={setTargetSize}
                                        targetUnit={targetUnit}
                                        setTargetUnit={setTargetUnit}
                                        onCompress={handleCompress}
                                        isCompressing={status === 'compressing'}
                                        originalSize={originalImageSize}
                                    />
                                    {status === 'compressing' && <ProgressBar progress={progress} />}
                                    {status === 'success' && compressedImagePreview && compressedImageSize && (
                                        <DownloadButton
                                            imageDataUrl={compressedImagePreview}
                                            originalFileName={originalImage.name}
                                            compressedSize={compressedImageSize}
                                        />
                                    )}
                                </div>
                                <div className="lg:col-span-2">
                                     <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-4 md:mb-6">Preview</h2>
                                     <ImagePreview
                                        originalImage={{ src: originalImagePreview, size: originalImageSize }}
                                        compressedImage={compressedImagePreview ? { src: compressedImagePreview, size: compressedImageSize } : null}
                                        status={status}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;