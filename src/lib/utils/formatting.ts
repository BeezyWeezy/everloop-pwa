// Утилиты для форматирования

/**
 * Форматирование размера файла
 * @param bytes - размер в байтах
 * @returns отформатированный размер
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Форматирование даты
 * @param date - дата для форматирования
 * @param locale - локаль (по умолчанию 'ru-RU')
 * @returns отформатированная дата
 */
export function formatDate(date: Date | string, locale: string = 'ru-RU'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Форматирование даты (короткий формат)
 * @param date - дата для форматирования
 * @param locale - локаль (по умолчанию 'ru-RU')
 * @returns отформатированная дата
 */
export function formatShortDate(date: Date | string, locale: string = 'ru-RU'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Форматирование времени
 * @param date - дата для форматирования
 * @param locale - локаль (по умолчанию 'ru-RU')
 * @returns отформатированное время
 */
export function formatTime(date: Date | string, locale: string = 'ru-RU'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Форматирование цены
 * @param price - цена
 * @param currency - валюта (по умолчанию 'USD')
 * @param locale - локаль (по умолчанию 'en-US')
 * @returns отформатированная цена
 */
export function formatPrice(price: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(price);
}

/**
 * Форматирование числа
 * @param number - число для форматирования
 * @param locale - локаль (по умолчанию 'en-US')
 * @returns отформатированное число
 */
export function formatNumber(number: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * Форматирование процентов
 * @param value - значение
 * @param total - общее значение
 * @param decimals - количество знаков после запятой (по умолчанию 1)
 * @returns отформатированный процент
 */
export function formatPercentage(value: number, total: number, decimals: number = 1): string {
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Сокращение текста
 * @param text - текст для сокращения
 * @param maxLength - максимальная длина
 * @param suffix - суффикс (по умолчанию '...')
 * @returns сокращенный текст
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Форматирование доменного имени
 * @param domain - доменное имя
 * @returns отформатированное доменное имя
 */
export function formatDomain(domain: string): string {
  return domain.toLowerCase().trim();
}

/**
 * Форматирование имени файла
 * @param filename - имя файла
 * @returns отформатированное имя файла
 */
export function formatFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Форматирование времени в относительном формате
 * @param date - дата для форматирования
 * @returns относительное время
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'только что';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин. назад`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ч. назад`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} дн. назад`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} нед. назад`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} мес. назад`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} лет назад`;
}
