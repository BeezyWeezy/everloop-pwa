import { supabase } from './supabaseClient';

/**
 * Загружает файл на Cloudflare R2 через существующий API endpoint
 */
export async function uploadFileToR2(file: File, projectId: string, fileType: 'logo' | 'screenshots'): Promise<string> {
  try {
    // Получаем токен авторизации
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Пользователь не авторизован');
    }

    // Создаем FormData для отправки файла
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    formData.append('type', fileType);

    // Отправляем файл через существующий API endpoint
    const response = await fetch('/api/upload/cloudflare', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Не удалось загрузить файл');
    }

    const result = await response.json();
    return result.publicUrl;
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    throw error;
  }
}

/**
 * Загружает логотип PWA
 */
export async function uploadPwaLogo(file: File, pwaId: string): Promise<string> {
  return uploadFileToR2(file, pwaId, 'logo');
}

/**
 * Загружает скриншот PWA
 */
export async function uploadPwaScreenshot(file: File, pwaId: string): Promise<string> {
  return uploadFileToR2(file, pwaId, 'screenshots');
}

/**
 * Удаляет файл с Cloudflare R2 через существующий API endpoint
 */
export async function deleteFileFromR2(fileUrl: string): Promise<boolean> {
  try {
    // Получаем токен авторизации
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Пользователь не авторизован');
    }

    // Извлекаем путь к файлу из URL
    // URL формат: https://pub-{account_id}.r2.dev/{user_id}/pwa/{project_id}/{type}/{filename}
    const publicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-fa14595df72b8620ea46669efd1c63fa.r2.dev';
    
    if (!fileUrl.startsWith(publicUrl)) {
      console.error('Неверный формат URL файла:', fileUrl);
      throw new Error('Неверный формат URL файла');
    }
    
    // Удаляем базовый URL и получаем путь к файлу
    const filePath = fileUrl.replace(publicUrl + '/', '');
    
    console.log('Удаляем файл:', filePath);

    const response = await fetch(`/api/delete/cloudflare?path=${encodeURIComponent(filePath)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ошибка удаления файла с R2:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Ошибка удаления файла:', error);
    return false;
  }
}

/**
 * Валидация файла изображения
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): { isValid: boolean; error?: string } {
  // Проверка типа файла
  if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/)) {
    return {
      isValid: false,
      error: 'Поддерживаются только PNG, JPG, JPEG и WebP файлы'
    };
  }
  
  // Проверка размера файла
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Размер файла не должен превышать ${maxSizeMB}MB`
    };
  }
  
  return { isValid: true };
}

/**
 * Создает превью изображения
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
