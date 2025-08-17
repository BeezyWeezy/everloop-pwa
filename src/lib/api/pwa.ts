// API клиент для работы с PWA
import { PWAService } from '../services/pwaService';
import type { PWAProject, PWAListItem, CreatePWARequest, UpdatePWARequest, PWADomain } from '../../types/pwa';
import { globalLogger } from '../utils/logger';
import { useLogger } from '@/lib/utils/logger';

/**
 * Создать новый PWA проект
 * @param data - данные для создания PWA
 * @returns созданный PWA проект
 */
export async function createPWA(data: CreatePWARequest): Promise<{
  data: PWAProject | null, error: any }> {
  try {
    return await PWAService.createPWA(data);
  } catch (error) {
    globalLogger.api.error('/api/pwa/create', error);
    throw error;
  }
}

/**
 * Получить все PWA проекты пользователя
 * @returns список PWA проектов
 */
export async function getUserPWAs(): Promise<{ data: PWAListItem[] | null, error: any }> {
  try {
    return await PWAService.getUserPWAs();
  } catch (error) {
    globalLogger.api.error('/api/pwa/list', error);
    throw error;
  }
}

/**
 * Получить конкретный PWA проект
 * @param id - ID PWA проекта
 * @returns PWA проект
 */
export async function getPWA(id: string): Promise<{ data: PWAProject | null, error: any }> {
  try {
    return await PWAService.getPWA(id);
  } catch (error) {
    globalLogger.api.error('/api/pwa/get', error);
    throw error;
  }
}

/**
 * Обновить PWA проект
 * @param data - данные для обновления
 * @returns обновленный PWA проект
 */
export async function updatePWA(data: UpdatePWARequest): Promise<{ data: PWAProject | null, error: any }> {
  try {
    return await PWAService.updatePWA(data);
  } catch (error) {
    globalLogger.api.error('/api/pwa/update', error);
    throw error;
  }
}

/**
 * Удалить PWA проект
 * @param id - ID PWA проекта
 * @returns результат удаления
 */
export async function deletePWA(id: string): Promise<{ error: any }> {
  try {
    return await PWAService.deletePWA(id);
  } catch (error) {
    globalLogger.api.error('/api/pwa/delete', error);
    throw error;
  }
}

/**
 * Изменить статус PWA
 * @param id - ID PWA проекта
 * @param status - новый статус
 * @returns обновленный PWA проект
 */
export async function updatePWAStatus(id: string, status: 'active' | 'paused' | 'draft'): Promise<{ data: PWAProject | null, error: any }> {
  try {
    return await PWAService.updatePWAStatus(id, status);
  } catch (error) {
    globalLogger.api.error('/api/pwa/status', error);
    throw error;
  }
}

/**
 * Добавить домен к PWA
 * @param pwaId - ID PWA проекта
 * @param domain - домен
 * @param isCustom - является ли домен кастомным
 * @returns добавленный домен
 */
export async function addDomainToPWA(pwaId: string, domain: string, isCustom: boolean = false): Promise<{ data: PWADomain | null, error: any }> {
  try {
    return await PWAService.addDomainToPWA(pwaId, domain, isCustom);
  } catch (error) {
    globalLogger.api.error('/api/pwa/domain/add', error);
    throw error;
  }
}

/**
 * Получить домены PWA
 * @param pwaId - ID PWA проекта
 * @returns список доменов
 */
export async function getPWADomains(pwaId: string): Promise<{ data: PWADomain[] | null, error: any }> {
  try {
    return await PWAService.getPWADomains(pwaId);
  } catch (error) {
    globalLogger.api.error('/api/pwa/domains', error);
    throw error;
  }
}

/**
 * Обновить логотип PWA
 * @param pwaId - ID PWA проекта
 * @param logoUrl - URL логотипа
 * @returns обновленный PWA проект
 */
export async function updatePWALogo(pwaId: string, logoUrl: string): Promise<{ data: PWAProject | null, error: any }> {
  try {
    return await PWAService.updatePWALogo(pwaId, logoUrl);
  } catch (error) {
    globalLogger.api.error('/api/pwa/logo/update', error);
    throw error;
  }
}

/**
 * Добавить скриншот к PWA
 * @param pwaId - ID PWA проекта
 * @param screenshotUrl - URL скриншота
 * @returns обновленный PWA проект
 */
export async function addPWAScreenshot(pwaId: string, screenshotUrl: string): Promise<{ data: PWAProject | null, error: any }> {
  try {
    return await PWAService.addPWAScreenshot(pwaId, screenshotUrl);
  } catch (error) {
    globalLogger.api.error('/api/pwa/screenshot/add', error);
    throw error;
  }
}

/**
 * Удалить скриншот из PWA
 * @param pwaId - ID PWA проекта
 * @param screenshotUrl - URL скриншота
 * @returns обновленный PWA проект
 */
export async function removePWAScreenshot(pwaId: string, screenshotUrl: string): Promise<{ data: PWAProject | null, error: any }> {
  try {
    return await PWAService.removePWAScreenshot(pwaId, screenshotUrl);
  } catch (error) {
    globalLogger.api.error('/api/pwa/screenshot/remove', error);
    throw error;
  }
}

/**
 * Удалить логотип PWA
 * @param pwaId - ID PWA проекта
 * @returns обновленный PWA проект
 */
export async function removePWALogo(pwaId: string): Promise<{ data: PWAProject | null, error: any }> {
  try {
    return await PWAService.removePWALogo(pwaId);
  } catch (error) {
    globalLogger.api.error('/api/pwa/logo/remove', error);
    throw error;
  }
}

/**
 * Обновить порядок скриншотов PWA
 * @param pwaId - ID PWA проекта
 * @param screenshots - массив URL скриншотов
 * @returns обновленный PWA проект
 */
export async function updatePWAScreenshotsOrder(pwaId: string, screenshots: string[]): Promise<{ data: PWAProject | null, error: any }> {
  try {
    return await PWAService.updatePWAScreenshotsOrder(pwaId, screenshots);
  } catch (error) {
    globalLogger.api.error('/api/pwa/screenshots/order', error);
    throw error;
  }
}
