// Namecheap API Provider
// Документация: https://www.namecheap.com/support/api/

export interface NamecheapDomainCheck {
  domain: string;
  available: boolean;
  price?: number;
  premiumPrice?: number;
  isPremium?: boolean;
}

export interface NamecheapDomainPurchaseRequest {
  domain: string;
  registrant: {
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

export interface NamecheapDomainPurchaseResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Namecheap API конфигурация
const NAMECHEAP_API_URL = process.env.NODE_ENV === 'development' 
  ? 'https://api.sandbox.namecheap.com/xml.response' // Тестовый API для разработки
  : 'https://api.namecheap.com/xml.response'; // Продакшн API
const NAMECHEAP_API_USER = process.env.NAMECHEAP_API_USER;
const NAMECHEAP_API_KEY = process.env.NAMECHEAP_API_KEY;
const NAMECHEAP_USERNAME = process.env.NAMECHEAP_USERNAME;
const NAMECHEAP_CLIENT_IP = process.env.NAMECHEAP_CLIENT_IP || '127.0.0.1';

// Кэш цен доменов
const domainPriceCache = new Map<string, number>();

// Функция для форматирования телефона в формат Namecheap
function formatPhoneForNamecheap(phone: string): string {
  // Убираем все символы кроме цифр
  const digits = phone.replace(/\D/g, '');
  
  // Если номер начинается с +1 (США), убираем +1
  if (digits.startsWith('1') && digits.length === 11) {
    return digits.substring(1);
  }
  
  // Если номер начинается с +, убираем +
  if (phone.startsWith('+')) {
    return digits;
  }
  
  return digits;
}

// Функция для получения стандартной цены по TLD
function getDefaultPriceForTld(tld: string): number {
  const cheapDomains = ['xyz', 'top', 'site', 'online', 'tech', 'space', 'website', 'digital', 'click', 'link', 'live', 'studio', 'design', 'art', 'blog', 'news', 'shop', 'store', 'app', 'dev'];
  const premiumDomains = ['casino', 'bet', 'games', 'club', 'vip', 'win', 'lucky', 'fortune', 'gold', 'silver', 'diamond', 'royal', 'elite', 'premium', 'luxury'];
  
  if (cheapDomains.includes(tld)) {
    return 1.99; // Дешевые домены
  } else if (premiumDomains.includes(tld)) {
    return 25.99; // Премиум домены
  } else {
    return 12.99; // Стандартные домены
  }
}

export class NamecheapProvider {
  private static validateCredentials() {
    if (!NAMECHEAP_API_USER || !NAMECHEAP_API_KEY || !NAMECHEAP_USERNAME) {
      throw new Error('Namecheap API credentials not configured');
    }
  }

  // Получить актуальную цену домена
  static async getDomainPrice(tld: string): Promise<number> {
    this.validateCredentials();

    // Проверяем кэш
    if (domainPriceCache.has(tld)) {
      return domainPriceCache.get(tld)!;
    }

    try {
      const params = new URLSearchParams({
        ApiUser: NAMECHEAP_API_USER!,
        ApiKey: NAMECHEAP_API_KEY!,
        UserName: NAMECHEAP_USERNAME!,
        Command: 'namecheap.users.getPricing',
        ClientIp: NAMECHEAP_CLIENT_IP,
        ProductType: 'DOMAIN',
        ActionName: 'REGISTER',
        ProductName: tld
      });

      const response = await fetch(`${NAMECHEAP_API_URL}?${params}`);
      const xmlText = await response.text();
      
      const priceRegex = new RegExp(`Name="${tld}"[^>]*Price="([^"]*)"`, 'i');
      const match = xmlText.match(priceRegex);
      
      if (match && match[1]) {
        const price = parseFloat(match[1]);
        domainPriceCache.set(tld, price);
        return price;
      }
      
      // Возвращаем стандартную цену если не удалось получить
      const defaultPrice = getDefaultPriceForTld(tld);
      domainPriceCache.set(tld, defaultPrice);
      return defaultPrice;
    } catch (error) {
      console.error('Error fetching domain price:', error);
      // Возвращаем стандартную цену при ошибке
      const defaultPrice = getDefaultPriceForTld(tld);
      domainPriceCache.set(tld, defaultPrice);
      return defaultPrice;
    }
  }

  // Проверить доступность домена
  static async checkDomainAvailability(domainName: string, tld: string): Promise<NamecheapDomainCheck> {
    this.validateCredentials();

    try {
      const params = new URLSearchParams({
        ApiUser: NAMECHEAP_API_USER!,
        ApiKey: NAMECHEAP_API_KEY!,
        UserName: NAMECHEAP_USERNAME!,
        Command: 'namecheap.domains.check',
        ClientIp: NAMECHEAP_CLIENT_IP,
        DomainList: `${domainName}.${tld}`
      });

      const response = await fetch(`${NAMECHEAP_API_URL}?${params}`);
      const xmlText = await response.text();
      
      const domain = `${domainName}.${tld}`;
      const isAvailable = xmlText.includes(`Domain="${domain}" Available="true"`);
      const isPremium = xmlText.includes(`Domain="${domain}" IsPremiumName="true"`);
      
      // Получаем цену
      const price = await this.getDomainPrice(tld);
      
      return {
        domain,
        available: isAvailable,
        price,
        isPremium,
        premiumPrice: isPremium && price ? price * 3 : undefined
      };
    } catch (error) {
      console.error('Domain availability check error:', error);
      return {
        domain: `${domainName}.${tld}`,
        available: false,
        price: undefined,
        isPremium: false
      };
    }
  }

  // Зарегистрировать домен
  static async registerDomain(
    domain: string, 
    registrant: NamecheapDomainPurchaseRequest['registrant'],
    clientIP?: string
  ): Promise<NamecheapDomainPurchaseResponse> {
    this.validateCredentials();

    try {
      const [domainName, tld] = domain.split('.');
              // Domain registration started
      
      if (!domainName || !tld) {
        return {
          success: false,
          error: 'Invalid domain format'
        };
      }
      
              const params = new URLSearchParams({
          ApiUser: NAMECHEAP_API_USER!,
          ApiKey: NAMECHEAP_API_KEY!,
          UserName: NAMECHEAP_USERNAME!,
          Command: 'namecheap.domains.create',
          ClientIp: clientIP || NAMECHEAP_CLIENT_IP,
          DomainName: domainName,
          Years: '1',
        
        // Registrant Contact
        RegistrantFirstName: registrant.firstName,
        RegistrantLastName: registrant.lastName,
        RegistrantAddress1: registrant.address1,
        RegistrantCity: registrant.city,
        RegistrantStateProvince: registrant.stateProvince,
        RegistrantPostalCode: registrant.postalCode,
        RegistrantCountry: registrant.country,
        RegistrantPhone: formatPhoneForNamecheap(registrant.phone),
        RegistrantEmailAddress: registrant.email,
        
        // Tech Contact (same as registrant)
        TechFirstName: registrant.firstName,
        TechLastName: registrant.lastName,
        TechAddress1: registrant.address1,
        TechCity: registrant.city,
        TechStateProvince: registrant.stateProvince,
        TechPostalCode: registrant.postalCode,
        TechCountry: registrant.country,
        TechPhone: formatPhoneForNamecheap(registrant.phone),
        TechEmailAddress: registrant.email,
        
        // Admin Contact (same as registrant)
        AdminFirstName: registrant.firstName,
        AdminLastName: registrant.lastName,
        AdminAddress1: registrant.address1,
        AdminCity: registrant.city,
        AdminStateProvince: registrant.stateProvince,
        AdminPostalCode: registrant.postalCode,
        AdminCountry: registrant.country,
        AdminPhone: formatPhoneForNamecheap(registrant.phone),
        AdminEmailAddress: registrant.email,
        
        // Billing Contact (same as registrant)
        BillingFirstName: registrant.firstName,
        BillingLastName: registrant.lastName,
        BillingAddress1: registrant.address1,
        BillingCity: registrant.city,
        BillingStateProvince: registrant.stateProvince,
        BillingPostalCode: registrant.postalCode,
        BillingCountry: registrant.country,
        BillingPhone: formatPhoneForNamecheap(registrant.phone),
        BillingEmailAddress: registrant.email,
      });

              // Namecheap API request prepared
      
      const response = await fetch(`${NAMECHEAP_API_URL}?${params}`, {
        method: 'POST'
      });
      
      const xmlText = await response.text();
              // Namecheap API response received
      
      // Парсим XML ответ
      if (xmlText.includes('Status="OK"')) {
        // Извлекаем TransactionID
        const transactionIdMatch = xmlText.match(/TransactionID="(\d+)"/);
        const transactionId = transactionIdMatch ? transactionIdMatch[1] : undefined;
        
        return {
          success: true,
          transactionId
        };
      } else {
        // Извлекаем ошибку более детально
        // Namecheap API error response
        
        // Пробуем разные паттерны для извлечения ошибки
        let errorNumber = 'Unknown';
        let errorMessage = 'Unknown error occurred';
        
        // Паттерн 1: <Error Number="123">Message</Error>
        const errorMatch1 = xmlText.match(/<Error Number="(\d+)">(.*?)<\/Error>/);
        if (errorMatch1) {
          errorNumber = errorMatch1[1];
          errorMessage = errorMatch1[2];
        } else {
          // Паттерн 2: <Error>Message</Error>
          const errorMatch2 = xmlText.match(/<Error>(.*?)<\/Error>/);
          if (errorMatch2) {
            errorMessage = errorMatch2[1];
          } else {
            // Паттерн 3: <Message>Error message</Message>
            const errorMatch3 = xmlText.match(/<Message>(.*?)<\/Message>/);
            if (errorMatch3) {
              errorMessage = errorMatch3[1];
            }
          }
        }
        
        // Namecheap API error details logged
        
        return {
          success: false,
          error: `Error ${errorNumber}: ${errorMessage}`
        };
      }
      
    } catch (error) {
      console.error('Domain registration error:', error);
      return {
        success: false,
        error: 'Failed to register domain'
      };
    }
  }

  // Настроить DNS домена
  static async setDomainDNS(domain: string): Promise<boolean> {
    this.validateCredentials();

    try {
      const params = new URLSearchParams({
        ApiUser: NAMECHEAP_API_USER!,
        ApiKey: NAMECHEAP_API_KEY!,
        UserName: NAMECHEAP_USERNAME!,
        Command: 'namecheap.domains.dns.setDefault',
        ClientIp: NAMECHEAP_CLIENT_IP,
        SLD: domain.split('.')[0],
        TLD: domain.split('.')[1],
      });

      const response = await fetch(`${NAMECHEAP_API_URL}?${params}`);
      const xmlText = await response.text();
      
      return xmlText.includes('Status="OK"');
    } catch (error) {
      console.error('DNS setup error:', error);
      return false;
    }
  }
}
