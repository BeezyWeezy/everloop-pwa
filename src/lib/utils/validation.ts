// Утилиты для валидации

/**
 * Валидация доменного имени
 * @param domain - доменное имя для проверки
 * @returns результат валидации
 */
export function validateDomain(domain: string): { isValid: boolean; error?: string } {
  if (!domain) {
    return { isValid: false, error: 'Доменное имя не может быть пустым' };
  }

  // Проверяем длину
  if (domain.length < 2) {
    return { isValid: false, error: 'Доменное имя должно содержать минимум 2 символа' };
  }

  if (domain.length > 63) {
    return { isValid: false, error: 'Доменное имя не может быть длиннее 63 символов' };
  }

  // Проверяем формат (только буквы, цифры, дефисы)
  const domainRegex = /^[a-zA-Z0-9-]+$/;
  if (!domainRegex.test(domain)) {
    return { isValid: false, error: 'Доменное имя может содержать только буквы, цифры и дефисы' };
  }

  // Проверяем, что не начинается и не заканчивается дефисом
  if (domain.startsWith('-') || domain.endsWith('-')) {
    return { isValid: false, error: 'Доменное имя не может начинаться или заканчиваться дефисом' };
  }

  // Проверяем, что не содержит два дефиса подряд
  if (domain.includes('--')) {
    return { isValid: false, error: 'Доменное имя не может содержать два дефиса подряд' };
  }

  return { isValid: true };
}

/**
 * Валидация email
 * @param email - email для проверки
 * @returns результат валидации
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'Email не может быть пустым' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Неверный формат email' };
  }

  return { isValid: true };
}

/**
 * Валидация пароля
 * @param password - пароль для проверки
 * @returns результат валидации
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Пароль не может быть пустым' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Пароль должен содержать минимум 8 символов' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Пароль не может быть длиннее 128 символов' };
  }

  // Проверяем наличие хотя бы одной буквы и одной цифры
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return { isValid: false, error: 'Пароль должен содержать хотя бы одну букву и одну цифру' };
  }

  return { isValid: true };
}

/**
 * Валидация URL
 * @param url - URL для проверки
 * @returns результат валидации
 */
export function validateURL(url: string): { isValid: boolean; error?: string } {
  if (!url) {
    return { isValid: false, error: 'URL не может быть пустым' };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Неверный формат URL' };
  }
}

/**
 * Валидация размера файла
 * @param file - файл для проверки
 * @param maxSize - максимальный размер в байтах
 * @returns результат валидации
 */
export function validateFileSize(file: File, maxSize: number): { isValid: boolean; error?: string } {
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return { isValid: false, error: `Размер файла не может превышать ${maxSizeMB}MB` };
  }

  return { isValid: true };
}

/**
 * Валидация типа файла
 * @param file - файл для проверки
 * @param allowedTypes - массив разрешенных MIME типов
 * @returns результат валидации
 */
export function validateFileType(file: File, allowedTypes: string[]): { isValid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `Разрешены только файлы типов: ${allowedTypes.join(', ')}` };
  }

  return { isValid: true };
}
