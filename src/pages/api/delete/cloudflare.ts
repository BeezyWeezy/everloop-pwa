// API endpoint для удаления файлов из Cloudflare R2
import { NextApiRequest, NextApiResponse } from 'next';
import { CloudflareProvider } from '@/lib/providers/cloudflare';
import { supabase } from '@/lib/providers/supabase';
import { useLogger } from '@/lib/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const logger = useLogger('delete');

  // Добавляем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Проверяем авторизацию
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { path } = req.query;
    
    if (!path || typeof path !== 'string') {
      return res.status(400).json({ error: 'Path is required' });
    }

    // Проверяем, что пользователь может удалить этот файл
    // (файл должен начинаться с user_id пользователя)
    if (!path.startsWith(user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Используем наш провайдер для удаления
    await CloudflareProvider.deleteFromR2(path);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });

  } catch (error) {
    logger.error('Delete error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Delete failed',
    });
  }
}
