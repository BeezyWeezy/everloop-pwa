// API endpoint для загрузки файлов в Cloudflare R2
import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { supabase } from '@/lib/supabaseClient';
import formidable from 'formidable';
import fs from 'fs';

// Настройка Cloudflare R2 S3-совместимого клиента
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

// Функция для проверки и создания bucket
async function ensureBucketExists(bucketName: string) {
  try {
    // Проверяем, существует ли bucket
    await r2Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket ${bucketName} already exists`);
  } catch (error: any) {
    if (error.name === 'NotFound' || error.name === 'NoSuchBucket') {
      console.log(`Bucket ${bucketName} does not exist, creating...`);
      try {
        await r2Client.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log(`Bucket ${bucketName} created successfully`);
      } catch (createError) {
        console.error(`Failed to create bucket ${bucketName}:`, createError);
        throw createError;
      }
    } else {
      console.error(`Error checking bucket ${bucketName}:`, error);
      throw error;
    }
  }
}

export const config = {
  api: {
    bodyParser: false, // Отключаем встроенный парсер для загрузки файлов
  },
};

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

    // Читаем файл
    const fileBuffer = fs.readFileSync(file.filepath);
    
    // Генерируем путь к файлу
    const timestamp = Date.now();
    const sanitizedFileName = file.originalFilename?.replace(/[^a-zA-Z0-9.-]/g, '_') || 'unnamed';
    const filePath = projectId 
      ? `${user.id}/pwa/${projectId}/${fileType || 'assets'}/${timestamp}_${sanitizedFileName}`
      : `${user.id}/temp/${timestamp}_${sanitizedFileName}`;

    console.log('File path:', filePath);

    // Убеждаемся, что bucket существует
    await ensureBucketExists(process.env.CLOUDFLARE_R2_BUCKET_NAME!);

    // Загружаем файл в Cloudflare R2
    const putCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: filePath,
      Body: fileBuffer,
      ContentType: file.mimetype || 'application/octet-stream',
      Metadata: {
        userId: user.id,
        projectId: projectId || '',
        fileType: fileType || '',
        originalName: file.originalFilename || '',
        uploadedAt: new Date().toISOString(),
      },
    });

    await r2Client.send(putCommand);
    console.log('File uploaded to R2 successfully');

    // Генерируем публичный URL
    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${filePath}`;

    // Удаляем временный файл
    fs.unlinkSync(file.filepath);

    res.status(200).json({
      success: true,
      filePath,
      publicUrl,
      fileName: file.originalFilename,
      size: file.size,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Upload failed',
    });
  }
}
