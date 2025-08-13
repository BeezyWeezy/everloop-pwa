import { NextApiRequest, NextApiResponse } from 'next';

interface NamecheapDomainCheck {
  domain: string;
  available: boolean;
  price?: number;
  premiumPrice?: number;
  isPremium?: boolean;
}

interface DomainSearchRequest {
  query: string;
}

interface DomainSearchResponse {
  success: boolean;
  domains?: NamecheapDomainCheck[];
  error?: string;
}

// Namecheap API конфигурация
const NAMECHEAP_API_URL = 'https://api.namecheap.com/xml.response';
const NAMECHEAP_API_USER = process.env.NAMECHEAP_API_USER;
const NAMECHEAP_API_KEY = process.env.NAMECHEAP_API_KEY;
const NAMECHEAP_USERNAME = process.env.NAMECHEAP_USERNAME;
const NAMECHEAP_CLIENT_IP = process.env.NAMECHEAP_CLIENT_IP || '127.0.0.1';

// Кэш для списка TLD (обновляется раз в час)
let cachedTlds: string[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 час

// Функция для получения всех доступных TLD через Namecheap API
async function getAvailableTlds(): Promise<string[]> {
  // Проверяем кэш
  const now = Date.now();
  if (cachedTlds && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('Using cached TLDs:', cachedTlds.length);
    return cachedTlds;
  }

  try {
    const params = new URLSearchParams({
      ApiUser: NAMECHEAP_API_USER!,
      ApiKey: NAMECHEAP_API_KEY!,
      UserName: NAMECHEAP_USERNAME!,
      Command: 'namecheap.domains.getTldList',
      ClientIp: NAMECHEAP_CLIENT_IP
    });

    const response = await fetch(`${NAMECHEAP_API_URL}?${params}`);
    const xmlText = await response.text();
    console.log('TLD List API response:', xmlText);
    
    // Парсим XML для получения списка TLD
    const tldMatches = xmlText.match(/<Tld Name="([^"]*)"[^>]*\/>/g);
    const tlds: string[] = [];
    
    if (tldMatches) {
      for (const match of tldMatches) {
        const nameMatch = match.match(/Name="([^"]*)"/);
        if (nameMatch && nameMatch[1]) {
          tlds.push(nameMatch[1]);
        }
      }
    }
    
    console.log('Available TLDs:', tlds);
    
    // Обновляем кэш
    if (tlds.length > 0) {
      cachedTlds = tlds;
      cacheTimestamp = now;
    }
    
    // Если API не работает, возвращаем популярные TLD включая дешевые
    if (tlds.length === 0) {
      return ['tk', 'ml', 'ga', 'cf', 'xyz', 'top', 'win', 'bid', 'trade', 'science', 'com', 'net', 'org', 'info', 'biz', 'site', 'online', 'app', 'co', 'io', 'me', 'tv', 'cc', 'ws', 'casino', 'bet', 'games', 'club', 'vip'];
    }
    
    return tlds;
  } catch (error) {
    console.error('Error fetching TLD list:', error);
    // Фоллбэк список популярных TLD включая дешевые
    return ['tk', 'ml', 'ga', 'cf', 'xyz', 'top', 'win', 'bid', 'trade', 'science', 'com', 'net', 'org', 'info', 'biz', 'site', 'online', 'app', 'co', 'io', 'me', 'tv', 'cc', 'ws', 'casino', 'bet', 'games', 'club', 'vip'];
  }
}

// Функция для получения цен через Namecheap API
async function getDomainPricing(tlds: string[]): Promise<Map<string, number>> {
  const priceMap = new Map<string, number>();
  
  // Временно используем только фоллбэк цены для тестирования
  console.log('Using fallback prices for testing');
  const fallbackPrices: { [key: string]: number } = {
    // Самые дешевые TLD
    'tk': 0.99, 'ml': 0.99, 'ga': 0.99, 'cf': 0.99,
    'xyz': 1.99, 'top': 2.99, 'win': 3.99, 'bid': 4.99, 'trade': 5.99, 'science': 6.99,
    // Популярные TLD
    'com': 13.98, 'net': 14.98, 'org': 13.98, 'info': 12.98, 'biz': 14.98,
    'site': 12.98, 'online': 8.98, 'app': 15.98, 'co': 24.98, 'io': 35.98,
    'me': 18.98, 'tv': 32.98, 'cc': 22.98, 'ws': 29.98,
    'casino': 25.98, 'bet': 22.98, 'games': 18.98, 'club': 9.98, 'vip': 19.98
  };
  
  for (const tld of tlds) {
    if (fallbackPrices[tld]) {
      priceMap.set(tld, fallbackPrices[tld]);
    } else {
      // Для неизвестных TLD устанавливаем базовую цену
      priceMap.set(tld, 15.98);
    }
  }
  
  return priceMap;
}

async function checkDomainAvailability(domainName: string, tld: string, priceMap: Map<string, number>): Promise<NamecheapDomainCheck> {
  const domain = `${domainName}.${tld}`;
  
  // Временно используем моки для тестирования
  const price = priceMap.get(tld);
  const isAvailable = Math.random() > 0.5; // Случайная доступность для тестирования
  const isPremium = Math.random() > 0.8; // 20% шанс на премиум
  
  console.log(`Mock domain ${domain}: available=${isAvailable}, premium=${isPremium}, price=${price}`);
  
  return {
    domain,
    available: isAvailable,
    price,
    isPremium,
    premiumPrice: isPremium && price ? price * 3 : undefined
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DomainSearchResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { query }: DomainSearchRequest = req.body;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ 
      success: false, 
      error: 'Domain query must be at least 2 characters' 
    });
  }

  // Валидация запроса (только буквы, цифры, дефисы)
  if (!/^[a-zA-Z0-9-]+$/.test(query)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Domain can only contain letters, numbers, and hyphens' 
    });
  }

  if (!NAMECHEAP_API_USER || !NAMECHEAP_API_KEY || !NAMECHEAP_USERNAME) {
    return res.status(500).json({ 
      success: false, 
      error: 'Namecheap API credentials not configured' 
    });
  }

  try {
    // Расширяем список включая самые дешевые TLD
    const cheapTlds = ['tk', 'ml', 'ga', 'cf', 'xyz', 'top', 'win', 'bid', 'trade', 'science'];
    const popularTlds = ['com', 'net', 'org', 'site', 'online'];
    const orderedTlds = [...cheapTlds, ...popularTlds];
    
    // Сначала получаем цены для TLD
    const priceMap = await getDomainPricing(orderedTlds);
    console.log('Price map:', Array.from(priceMap.entries()));
    
    // Проверяем доступность для отобранных TLD
    const domainChecks = await Promise.all(
      orderedTlds.map(tld => checkDomainAvailability(query, tld, priceMap))
    );

    console.log('Domain checks before filter:', domainChecks);

    // Сортируем: сначала доступные по цене (самые дешевые первыми), потом недоступные
    const sortedDomains = domainChecks
      .sort((a, b) => {
        // Сначала доступные
        if (a.available && !b.available) return -1;
        if (!a.available && b.available) return 1;
        
        // Среди доступных - сортируем по цене (самые дешевые первыми)
        if (a.available && b.available) {
          return (a.price || 999) - (b.price || 999);
        }
        
        // Среди недоступных - тоже по цене
        return (a.price || 999) - (b.price || 999);
      });

    console.log('Final sorted domains:', sortedDomains);

    res.status(200).json({
      success: true,
      domains: sortedDomains
    });

  } catch (error) {
    console.error('Domain search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search domains'
    });
  }
}
