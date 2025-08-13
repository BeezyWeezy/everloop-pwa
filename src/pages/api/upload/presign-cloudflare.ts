// API endpoint для генерации подписанных URL для прямой загрузки в Cloudflare R2
import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { supabase } from '@/lib/supabaseClient';

// Настройка Cloudflare R2 S3-совместимого клиента
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Добавляем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
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

    const { fileName, fileType, projectId } = req.body;
    
    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'fileName and fileType are required' });
    }

    // Генерируем уникальный путь к файлу
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = projectId 
      ? `${user.id}/pwa/${projectId}/${timestamp}_${sanitizedFileName}`
      : `${user.id}/temp/${timestamp}_${sanitizedFileName}`;

    // Создаем команду для загрузки
    const putCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: filePath,
      ContentType: fileType,
      // Добавляем метаданные
      Metadata: {
        userId: user.id,
        projectId: projectId || '',
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Генерируем подписанный URL (действует 15 минут)
    const signedUrl = await getSignedUrl(r2Client, putCommand, { 
      expiresIn: 900 // 15 минут
    });

    // Генерируем URL для доступа к файлу (публичный URL)
    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${filePath}`;

    res.status(200).json({
      signedUrl,
      filePath,
      publicUrl,
      expiresIn: 900,
    });

  } catch (error) {
    console.error('Presign error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate signed URL',
    });
  }
}
