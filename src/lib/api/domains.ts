// API клиент для работы с доменами
import { DomainService } from '../services/domainService';
import type { DomainSearchResult, DomainPurchaseRequest, DomainPurchaseResult } from '../services/domainService';
import { useLogger } from '@/lib/utils/logger';

/**
 * Поиск доменов
 * @param query - поисковый запрос
 * @returns массив результатов поиска доменов
 */
export async function searchDomains(query: string): Promise<DomainSearchResult[]> {
    const logger = useLogger('api');

  try {
    return await DomainService.searchDomains(query);
  } catch (error) {
    console.error('Domain search error:', error);
    throw error;
  }
}

/**
 * Покупка домена
 * @param request - данные для покупки домена
 * @returns результат покупки
 */
export async function purchaseDomain(request: DomainPurchaseRequest): Promise<DomainPurchaseResult> {
  try {
    return await DomainService.purchaseDomain(request);
  } catch (error) {
    console.error('Domain purchase error:', error);
    throw error;
  }
}

/**
 * Настройка DNS для домена
 * @param domain - домен
 * @param targetUrl - целевой URL
 * @returns успешность настройки
 */
export async function setupDNS(domain: string, targetUrl: string): Promise<boolean> {
  try {
    return await DomainService.setupDNS(domain, targetUrl);
  } catch (error) {
    console.error('DNS setup error:', error);
    throw error;
  }
}

/**
 * Получить информацию о домене
 * @param domain - домен
 * @returns информация о домене
 */
export async function getDomainInfo(domain: string): Promise<DomainSearchResult | null> {
  try {
    return await DomainService.getDomainInfo(domain);
  } catch (error) {
    console.error('Get domain info error:', error);
    throw error;
  }
}

/**
 * Проверить доступность домена
 * @param domain - домен
 * @returns доступность домена
 */
export async function checkDomainAvailability(domain: string): Promise<boolean> {
  try {
    return await DomainService.checkAvailability(domain);
  } catch (error) {
    console.error('Check domain availability error:', error);
    throw error;
  }
}

/**
 * Установить провайдера доменов
 * @param provider - провайдер ('namecheap' | 'cloudflare')
 */
export function setDomainProvider(provider: 'namecheap' | 'cloudflare') {
  DomainService.setProvider(provider);
}

/**
 * Получить текущего провайдера доменов
 * @returns текущий провайдер
 */
export function getDomainProvider(): 'namecheap' | 'cloudflare' {
  return DomainService.getProvider();
}
