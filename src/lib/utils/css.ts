import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Утилита для объединения CSS классов
 * @param inputs - CSS классы для объединения
 * @returns объединенная строка CSS классов
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
