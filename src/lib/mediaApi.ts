// API для работы с медиафайлами PWA через Cloudflare R2
import { supabase } from './supabaseClient';

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
 * Загружает медиафайл для PWA через серверный API (обходим CORS проблемы)
 */
export async function uploadPWAMedia(
  pwaId: string,
  file: File,
  type: keyof typeof FILE_CONSTRAINTS,
  metadata?: MediaFile['metadata']
) {
  try {
    // Валидация файла
    const constraints = FILE_CONSTRAINTS[type];
    
    if (file.size > constraints.maxSize) {
      throw new Error(`Файл слишком большой. Максимальный размер: ${constraints.maxSize / (1024 * 1024)}MB`);
    }
    
    if (!constraints.allowedTypes.includes(file.type)) {
      throw new Error(`Неподдерживаемый тип файла. Разрешены: ${constraints.allowedTypes.join(', ')}`);
    }

    // Получаем сессию пользователя
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('Пользователь не авторизован');
    }

    // Используем серверный endpoint для загрузки (обходим CORS)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', pwaId);
    formData.append('type', type);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await fetch('/api/upload/cloudflare', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      throw new Error(errorData.error || 'Ошибка загрузки файла');
    }

    const result = await response.json();

    // Создаем объект медиафайла
    const mediaFile: MediaFile = {
      id: result.filePath,
      name: result.fileName || file.name,
      url: result.publicUrl,
      size: result.size || file.size,
      type,
      metadata,
    };

    // Пытаемся обновить media_config в базе данных
    try {
      await updatePWAMediaConfig(pwaId, type, mediaFile, 'add');
      console.log('Media config updated in database');
    } catch (dbError) {
      console.warn('Failed to update database, but file uploaded successfully:', dbError);
      // Не прерываем выполнение - файл уже загружен
    }

    console.log('Media file uploaded successfully:', mediaFile);

    return { data: mediaFile, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Неизвестная ошибка') 
    };
  }
}

/**
 * Получает все медиафайлы PWA
 */
export async function getPWAMedia(pwaId: string) {
  try {
    const { data, error } = await supabase
      .from('pwa_projects')
      .select('media_config')
      .eq('id', pwaId)
      .single();

    if (error) {
      throw new Error(`Ошибка получения медиафайлов: ${error.message}`);
    }

    return { 
      data: (data?.media_config || {
        icons: [],
        screenshots: [],
        videos: [],
        assets: []
      }) as MediaConfig, 
      error: null 
    };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Неизвестная ошибка') 
    };
  }
}

/**
 * Удаляет медиафайл PWA из Cloudflare R2
 */
export async function deletePWAMedia(
  pwaId: string,
  mediaId: string,
  type: keyof typeof FILE_CONSTRAINTS
) {
  try {
    // Получаем сессию пользователя
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('Пользователь не авторизован');
    }

    // Удаляем файл через API
    const response = await fetch(`/api/delete/cloudflare?path=${encodeURIComponent(mediaId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка удаления файла');
    }

    // Обновляем media_config в базе данных
    await updatePWAMediaConfig(pwaId, type, { id: mediaId } as MediaFile, 'remove');

    return { data: true, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Неизвестная ошибка') 
    };
  }
}

/**
 * Обновляет конфигурацию медиа в базе данных
 */
async function updatePWAMediaConfig(
  pwaId: string,
  type: keyof typeof FILE_CONSTRAINTS,
  mediaFile: MediaFile,
  operation: 'add' | 'remove'
) {
  // Получаем текущую конфигурацию
  const { data: currentConfig } = await getPWAMedia(pwaId);
  if (!currentConfig) {
    throw new Error('Не удалось получить текущую конфигурацию');
  }

  const mediaKey = `${type}s` as keyof MediaConfig;
  const mediaArray = [...(currentConfig[mediaKey] as MediaFile[])];

  if (operation === 'add') {
    mediaArray.push(mediaFile);
  } else {
    const index = mediaArray.findIndex(file => file.id === mediaFile.id);
    if (index > -1) {
      mediaArray.splice(index, 1);
    }
  }

  // Обновляем в базе данных
  const { error } = await supabase
    .from('pwa_projects')
    .update({
      media_config: {
        ...currentConfig,
        [mediaKey]: mediaArray,
      },
    })
    .eq('id', pwaId);

  if (error) {
    throw new Error(`Ошибка обновления конфигурации: ${error.message}`);
  }
}

/**
 * Валидирует изображение и получает его метаданные
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
 * Валидирует видео и получает его метаданные
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
