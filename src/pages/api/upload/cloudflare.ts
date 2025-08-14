// API endpoint для загрузки файлов в Cloudflare R2
import { NextApiRequest, NextApiResponse } from 'next';
import { CloudflareProvider } from '@/lib/providers/cloudflare';
import { supabase } from '@/lib/providers/supabase';
import formidable from 'formidable';
import fs from 'fs';
import { useLogger } from '@/lib/utils/logger';

export const config = {
  api: {
    bodyParser: false, // Отключаем встроенный парсер для загрузки файлов
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const logger = useLogger('upload');

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

    // Парсим multipart/form-data
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const projectId = Array.isArray(fields.projectId) ? fields.projectId[0] : fields.projectId;
    const fileType = Array.isArray(fields.type) ? fields.type[0] : fields.type;
    const metadata = fields.metadata ? JSON.parse(Array.isArray(fields.metadata) ? fields.metadata[0] : fields.metadata) : null;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    console.log('Uploading file:', {
      name: file.originalFilename,
      size: file.size,
      type: file.mimetype,
      projectId,
      fileType
    });

    // Генерируем путь к файлу
    const timestamp = Date.now();
    const sanitizedFileName = file.originalFilename?.replace(/[^a-zA-Z0-9.-]/g, '_') || 'unnamed';
    const filePath = projectId 
      ? `${user.id}/pwa/${projectId}/${fileType || 'assets'}/${timestamp}_${sanitizedFileName}`
      : `${user.id}/temp/${timestamp}_${sanitizedFileName}`;

    logger.info('File path:', filePath);

    // Читаем файл и создаем File объект
    const fileBuffer = fs.readFileSync(file.filepath);
    const fileBlob = new Blob([fileBuffer], { type: file.mimetype || 'application/octet-stream' });
    const fileObject = new File([fileBlob], file.originalFilename || 'unnamed', {
      type: file.mimetype || 'application/octet-stream'
    });

    // Используем наш провайдер для загрузки
    const result = await CloudflareProvider.uploadToR2(fileObject, filePath);

    // Удаляем временный файл
    fs.unlinkSync(file.filepath);

    res.status(200).json({
      success: true,
      filePath,
      publicUrl: result.url,
      fileName: result.fileName,
      size: result.size,
    });

  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Upload failed',
    });
  }
}
