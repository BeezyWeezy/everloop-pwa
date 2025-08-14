// Доменный сервис - бизнес-логика для работы с доменами
import { NamecheapProvider, CloudflareProvider } from '../providers';
import type { 
  NamecheapDomainCheck, 
  NamecheapDomainPurchaseRequest,
  CloudflareDomain 
} from '../providers';

export interface DomainSearchResult {
  domain: string;
  available: boolean;
  price?: number;
  premiumPrice?: number;
  isPremium?: boolean;
  provider: 'namecheap' | 'cloudflare';
}

export interface DomainPurchaseRequest {
  domain: string;
  price: number;
  userId: string;
  provider: 'namecheap' | 'cloudflare';
  clientIP?: string;
  registrant?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
  };
}

export interface DomainPurchaseResult {
  success: boolean;
  transactionId?: string;
  domain?: string;
  expiryDate?: string;
  error?: string;
}

export class DomainService {
  private static provider: 'namecheap' | 'cloudflare' = 'namecheap';

  // Установить провайдера доменов
  static setProvider(provider: 'namecheap' | 'cloudflare') {
    this.provider = provider;
  }

  // Получить текущего провайдера
  static getProvider() {
    return this.provider;
  }

  // Поиск доменов
  static async searchDomains(query: string): Promise<DomainSearchResult[]> {
    try {
      if (this.provider === 'cloudflare') {
        const domains = await CloudflareProvider.searchDomains(query);
        return domains.map(domain => ({
          domain: domain.name,
          available: domain.available,
          price: domain.price,
          isPremium: false, // Cloudflare не возвращает информацию о премиум доменах
          provider: 'cloudflare' as const
        }));
      } else {
        // Используем Namecheap - добавляем дешевые домены
        const tlds = [
          // Дешевые домены ($1-5)
          'xyz', 'top', 'site', 'online', 'tech', 'space', 'website', 'digital', 'click', 'link', 'live', 'studio', 'design', 'art', 'blog', 'news', 'shop', 'store', 'app', 'dev',
          // Средние домены ($5-15)
          'com', 'net', 'org', 'io', 'co', 'me', 'tv', 'cc', 'ws', 'info', 'biz', 'us', 'uk', 'de', 'ru', 'ca', 'au', 'in', 'br', 'fr',
          // Премиум домены для казино
          'casino', 'bet', 'games', 'club', 'vip', 'win', 'lucky', 'fortune', 'gold', 'silver', 'diamond', 'royal', 'elite', 'premium', 'luxury'
        ];
        
        const domainChecks = await Promise.all(
          tlds.map(async (tld) => {
            try {
              return await NamecheapProvider.checkDomainAvailability(query, tld);
            } catch (error) {
              console.error('Error checking domain ${query}.${tld}:', error);
              return {
                domain: `${query}.${tld}`,
                available: false,
                price: undefined,
                isPremium: false
              };
            }
          })
        );

        // Фильтруем только доступные домены и сортируем по цене
        const availableDomains = domainChecks
          .filter(domain => domain.available)
          .map(domain => ({
            ...domain,
            provider: 'namecheap' as const
          }))
          .sort((a, b) => (a.price || 0) - (b.price || 0))
          .slice(0, 10); // Показываем 10 доменов, включая дешевые

        return availableDomains;
      }
    } catch (error) {
      console.error('Domain search error:', error);
      throw error;
    }
  }

  // Покупка домена
  static async purchaseDomain(request: DomainPurchaseRequest): Promise<DomainPurchaseResult> {
    try {
      if (this.provider === 'cloudflare') {
        const result = await CloudflareProvider.purchaseDomain(
          request.domain,
          true, // privacy
          true  // auto_renew
        );

        if (result) {
          const expiryDate = new Date(result.expires_at);
          
          return {
            success: true,
            transactionId: result.id,
            domain: result.name,
            expiryDate: expiryDate.toISOString()
          };
        } else {
          return {
            success: false,
            error: 'Failed to purchase domain'
          };
        }
      } else {
        // Используем Namecheap
        const registrant = request.registrant || {
          firstName: 'John',
          lastName: 'Doe',
          email: 'user3312@gmail.com',
          phone: '+1934567890', // Убираем + для Namecheap
          address1: '123 Main Street',
          city: 'Los Angeles',
          stateProvince: 'CA',
          postalCode: '90210', // Исправляем на валидный ZIP код
          country: 'US'
        };

        const result = await NamecheapProvider.registerDomain(request.domain, registrant, request.clientIP);

        if (result.success) {
          const expiryDate = new Date();
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);

          return {
            success: true,
            transactionId: result.transactionId,
            domain: request.domain,
            expiryDate: expiryDate.toISOString()
          };
        } else {
          return {
            success: false,
            error: result.error || 'Failed to purchase domain'
          };
        }
      }
    } catch (error) {
      console.error('Domain purchase error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Настройка DNS
  static async setupDNS(domain: string, targetUrl: string): Promise<boolean> {
    try {
      if (this.provider === 'cloudflare') {
        await CloudflareProvider.setupDNS(domain, targetUrl);
        return true;
      } else {
        return await NamecheapProvider.setDomainDNS(domain);
      }
    } catch (error) {
      console.error('DNS setup error:', error);
      return false;
    }
  }

  // Получить информацию о домене
  static async getDomainInfo(domain: string): Promise<DomainSearchResult | null> {
    try {
      if (this.provider === 'cloudflare') {
        const info = await CloudflareProvider.getDomainInfo(domain);
        if (info) {
          return {
            domain: info.name,
            available: info.available,
            price: info.price,
            isPremium: false,
            provider: 'cloudflare' as const
          };
        }
      } else {
        const [domainName, tld] = domain.split('.');
        const info = await NamecheapProvider.checkDomainAvailability(domainName, tld);
        return {
          ...info,
          provider: 'namecheap' as const
        };
      }
      return null;
    } catch (error) {
      console.error('Get domain info error:', error);
      return null;
    }
  }

  // Проверить доступность домена
  static async checkAvailability(domain: string): Promise<boolean> {
    try {
      const info = await this.getDomainInfo(domain);
      return info?.available || false;
    } catch (error) {
      console.error('Check availability error:', error);
      return false;
    }
  }
}
