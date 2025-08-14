// Утилиты для работы с PWA

/**
 * Генерирует slug для URL из названия
 * @param name - полное название PWA
 * @returns slug для использования в URL
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // убираем специальные символы
    .replace(/\s+/g, '-')     // заменяем пробелы на дефисы
    .replace(/-+/g, '-')      // убираем повторяющиеся дефисы
    .replace(/^-|-$/g, '');   // убираем дефисы в начале и конце
}

/**
 * Получает первую букву названия для иконки
 * @param name - полное название PWA
 * @returns первая буква в верхнем регистре
 */
export function getInitialLetter(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}
