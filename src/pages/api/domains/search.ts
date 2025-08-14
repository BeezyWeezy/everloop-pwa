import { NextApiRequest, NextApiResponse } from 'next';
import { DomainService } from '@/lib/services/domainService';
import { globalLogger } from '@/lib/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

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

    // Используем наш сервис для поиска доменов
    const domains = await DomainService.searchDomains(query.trim());

    globalLogger.api.success('/api/domains/search', `Found ${domains.length} domains for "${query.trim()}"`);

    res.status(200).json({
      success: true,
      domains: domains.map(domain => ({
        domain: domain.domain,
        available: domain.available,
        price: domain.price,
        premiumPrice: domain.premiumPrice,
        isPremium: domain.isPremium
      }))
    });

  } catch (error) {
    globalLogger.api.error('/api/domains/search', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search domains'
    });
  }
}
