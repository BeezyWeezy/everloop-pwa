// Типы для работы с медиафайлами

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: 'icon' | 'screenshot' | 'video' | 'asset';
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
  };
  uploadedAt: string;
  updatedAt: string;
}

export interface MediaConfig {
  icons: MediaFile[];
  screenshots: MediaFile[];
  videos: MediaFile[];
  assets: MediaFile[];
}

export interface MediaUploadResult {
  success: boolean;
  file?: MediaFile;
  error?: string;
}

export interface MediaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  format: string;
  size: number;
  fps?: number;
  bitrate?: number;
}

export type MediaType = 'icon' | 'screenshot' | 'video' | 'asset';

export interface MediaConstraints {
  maxSize: number;
  allowedTypes: string[];
  maxCount?: number;
  requiredSizes?: number[];
  maxDuration?: number;
}
