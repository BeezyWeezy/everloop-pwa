// API клиент для работы с хранилищем файлов
import { CloudflareProvider } from '../providers/cloudflare';
import { useLogger } from '@/lib/utils/logger';

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
  };
}

export interface MediaConfig {
  icons: MediaFile[];
  screenshots: MediaFile[];
  videos: MediaFile[];
  assets: MediaFile[];
}

// Типы файлов и их ограничения
const FILE_CONSTRAINTS = {
  icon: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/x-icon'],
    requiredSizes: [192, 512], // для PWA манифеста
  },
  screenshot: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxCount: 8,
  },
  video: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['video/mp4', 'video/webm'],
    maxDuration: 30, // секунд
  },
  asset: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
};

/**
 * Загрузить файл в хранилище
 * @param file - файл для загрузки
 * @param path - путь в хранилище
 * @returns информация о загруженном файле
 */
export async function uploadFile(
  file: File,
  path: string
): Promise<{
  url: string; size: number; fileName: string }> {
  try {
    return await CloudflareProvider.uploadToR2(file, path);
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
}

/**
 * Удалить файл из хранилища
 * @param path - путь к файлу в хранилище
 * @returns успешность удаления
 */
export async function deleteFile(path: string): Promise<boolean> {
  try {
    return await CloudflareProvider.deleteFromR2(path);
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
}

/**
 * Получить публичный URL файла
 * @param path - путь к файлу в хранилище
 * @returns публичный URL
 */
export function getPublicUrl(path: string): string {
  try {
    return CloudflareProvider.getR2PublicUrl(path);
  } catch (error) {
    console.error('Get public URL error:', error);
    throw error;
  }
}

/**
 * Загрузить медиафайл для PWA
 * @param pwaId - ID PWA проекта
 * @param file - файл для загрузки
 * @param type - тип медиафайла
 * @param metadata - метаданные файла
 * @returns информация о загруженном медиафайле
 */
export async function uploadPWAMedia(
  pwaId: string,
  file: File,
  type: keyof typeof FILE_CONSTRAINTS,
  metadata?: MediaFile['metadata']
): Promise<{ data: MediaFile | null, error: any }> {
  try {
    // Валидация файла
    const constraints = FILE_CONSTRAINTS[type];
    
    if (file.size > constraints.maxSize) {
      throw new Error(`Файл слишком большой. Максимальный размер: ${constraints.maxSize / (1024 * 1024)}MB`);
    }
    
    if (!constraints.allowedTypes.includes(file.type)) {
      throw new Error(`Неподдерживаемый тип файла. Разрешены: ${constraints.allowedTypes.join(', ')}`);
    }

    // Генерируем путь для файла
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}_${timestamp}.${fileExtension}`;
    const filePath = `pwa/${pwaId}/${type}/${fileName}`;

    // Загружаем файл
    const uploadResult = await uploadFile(file, filePath);

    // Создаем объект медиафайла
    const mediaFile: MediaFile = {
      id: filePath,
      name: uploadResult.fileName || file.name,
      url: uploadResult.url,
      size: uploadResult.size,
      type,
      metadata,
    };

    return { data: mediaFile, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Неизвестная ошибка') 
    };
  }
}

/**
 * Удалить медиафайл PWA
 * @param pwaId - ID PWA проекта
 * @param mediaId - ID медиафайла
 * @param type - тип медиафайла
 * @returns результат удаления
 */
export async function deletePWAMedia(
  pwaId: string,
  mediaId: string,
  type: keyof typeof FILE_CONSTRAINTS
): Promise<{ data: boolean | null, error: any }> {
  try {
    const success = await deleteFile(mediaId);
    return { data: success, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Неизвестная ошибка') 
    };
  }
}

/**
 * Валидировать изображение и получить его метаданные
 * @param file - файл изображения
 * @returns метаданные изображения
 */
export function validateImage(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Валидировать видео и получить его метаданные
 * @param file - файл видео
 * @returns метаданные видео
 */
export function validateVideo(file: File): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
    };
    video.onerror = () => reject(new Error('Не удалось загрузить видео'));
    video.src = URL.createObjectURL(file);
  });
}

/**
 * Валидировать изображение для загрузки
 * @param file - файл изображения
 * @param maxSizeMB - максимальный размер в MB
 * @returns результат валидации
 */
export function validateImageFile(file: File, maxSizeMB: number): { isValid: boolean; error?: string } {
  // Проверяем тип файла
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Файл должен быть изображением' };
  }

  // Проверяем размер
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `Размер файла не должен превышать ${maxSizeMB}MB` };
  }

  return { isValid: true };
}

/**
 * Создать превью изображения
 * @param file - файл изображения
 * @returns URL превью
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Не удалось создать превью'));
      }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsDataURL(file);
  });
}

/**
 * Загрузить логотип PWA
 * @param file - файл логотипа
 * @param pwaId - ID PWA
 * @returns URL загруженного логотипа
 */
export async function uploadPwaLogo(file: File, pwaId: string): Promise<string> {
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const fileName = `logo_${timestamp}.${fileExtension}`;
  const filePath = `pwa/${pwaId}/logo/${fileName}`;

  const result = await uploadFile(file, filePath);
  return result.url;
}
