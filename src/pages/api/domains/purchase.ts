import { NextApiRequest, NextApiResponse } from 'next';
import { DomainService } from '@/lib/services/domainService';
import { globalLogger } from '@/lib/utils/logger';

// Функция для получения реального IP адреса
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0];
  }
  
  if (typeof realIP === 'string') {
    return realIP;
  }
  
  return req.socket.remoteAddress || '127.0.0.1';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { domain, price, registrant } = req.body;

    // Валидация основных данных
    if (!domain || !price) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: domain, price' 
      });
    }

    const clientIP = getClientIP(req);
    globalLogger.api.info('/api/domains/purchase', `Purchase request for domain: ${domain}`, { price, registrant, clientIP });

    // Используем наш сервис для покупки домена
    const result = await DomainService.purchaseDomain({
      domain,
      price,
      userId: 'anonymous', // Для Namecheap не нужен userId
      provider: DomainService.getProvider(),
      clientIP,
      registrant
    });

    if (result.success) {
      globalLogger.api.success('/api/domains/purchase', `Successfully purchased domain: ${domain}`);
    } else {
      globalLogger.api.error('/api/domains/purchase', result.error || 'Unknown error');
    }

    if (result.success) {
      res.status(200).json({
        success: true,
        transactionId: result.transactionId,
        domain: result.domain,
        expiryDate: result.expiryDate
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to purchase domain'
      });
    }

  } catch (error) {
    globalLogger.api.error('/api/domains/purchase', error);
    res.status(500).json({
      success: false,
      error: 'Failed to purchase domain'
    });
  }
}
