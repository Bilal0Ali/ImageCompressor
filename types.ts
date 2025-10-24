
export type CompressionStatus = 'idle' | 'compressing' | 'success' | 'error';
export type TargetUnit = 'KB' | 'MB';

export interface ImageInfo {
    src: string | null;
    size: number | null;
}

export interface GeminiCompressionParams {
    quality: number;
    newWidth: number | null;
}
