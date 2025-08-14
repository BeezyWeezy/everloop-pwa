import { useLogger } from '@/lib/utils/logger';

// Cloudflare API Provider
// Документация: https://developers.cloudflare.com/api/

export interface CloudflareDomain {
  id: string;
  name: string;
  status: string;
  available: boolean;
  price?: number;
  currency?: string;
  period?: number;
  transfer_in?: {
    price?: number;
    currency?: string;
  };
}

export interface CloudflareDomainSearchResponse {
  success: boolean;
  result: CloudflareDomain[];
  errors?: any[];
}

export interface CloudflareDomainPurchaseRequest {
  name: string;
  privacy?: boolean;
  auto_renew?: boolean;
}

export interface CloudflareDomainPurchaseResponse {
  success: boolean;
  result?: {
    id: string;
    name: string;
    status: string;
    created_at: string;
    expires_at: string;
  };
  errors?: any[];
}

export interface CloudflareDNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
}

// Cloudflare API конфигурация
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT;
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const CLOUDFLARE_R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL;

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

export class CloudflareProvider {
  // ===== DOMAINS API =====
  
  private static validateDomainCredentials() {
    if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
      throw new Error('Cloudflare API credentials not configured');
    }
  }

  // Поиск доменов через Cloudflare
  static async searchDomains(query: string): Promise<CloudflareDomain[]> {
    this.validateDomainCredentials();

    try {
      const response = await fetch(`${CLOUDFLARE_API_BASE}/domains/check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domains: [
            `${query}.com`,
            `${query}.net`,
            `${query}.org`,
            `${query}.site`,
            `${query}.online`,
            `${query}.app`,
            `${query}.io`,
            `${query}.co`,
            `${query}.me`,
            `${query}.tv`,
            `${query}.cc`,
            `${query}.ws`,
            `${query}.casino`,
            `${query}.bet`,
            `${query}.games`,
            `${query}.club`,
            `${query}.vip`,
            `${query}.xyz`,
            `${query}.top`,
            `${query}.win`
          ]
        })
      });

      const data: CloudflareDomainSearchResponse = await response.json();

      if (!data.success) {
        console.error('Cloudflare domain search error:', data.errors);
        throw new Error('Failed to search domains');
      }

      return data.result || [];
    } catch (error) {
      console.error('Cloudflare domain search error:', error);
      throw error;
    }
  }

  // Покупка домена через Cloudflare
  static async purchaseDomain(
    domainName: string,
    privacy: boolean = true,
    autoRenew: boolean = true
  ): Promise<CloudflareDomainPurchaseResponse['result']> {
    this.validateDomainCredentials();

    try {
      const response = await fetch(`${CLOUDFLARE_API_BASE}/accounts/${CLOUDFLARE_ACCOUNT_ID}/domains`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: domainName,
          privacy,
          auto_renew: autoRenew
        })
      });

      const data: CloudflareDomainPurchaseResponse = await response.json();

      if (!data.success) {
        console.error('Cloudflare domain purchase error:', data.errors);
        throw new Error('Failed to purchase domain');
      }

      return data.result;
    } catch (error) {
      console.error('Cloudflare domain purchase error:', error);
      throw error;
    }
  }

  // Настройка DNS записей через Cloudflare
  static async setupDNS(
    domainName: string,
    targetUrl: string
  ): Promise<void> {
    if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
      throw new Error('Cloudflare API credentials not configured');
    }

    try {
      // Создаем CNAME запись для домена
      const cnameRecord = {
        type: 'CNAME',
        name: domainName,
        content: targetUrl,
        ttl: 1, // Auto
        proxied: true // Включаем Cloudflare прокси
      };

      const response = await fetch(`${CLOUDFLARE_API_BASE}/zones/${CLOUDFLARE_ZONE_ID}/dns_records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cnameRecord)
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Cloudflare DNS setup error:', data.errors);
        throw new Error('Failed to setup DNS records');
      }
    } catch (error) {
      console.error('Cloudflare DNS setup error:', error);
      throw error;
    }
  }

  // Получить информацию о домене
  static async getDomainInfo(domainName: string): Promise<CloudflareDomain | null> {
    this.validateDomainCredentials();

    try {
      const response = await fetch(`${CLOUDFLARE_API_BASE}/accounts/${CLOUDFLARE_ACCOUNT_ID}/domains/${domainName}`, {
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Cloudflare get domain info error:', data.errors);
        return null;
      }

      return data.result;
    } catch (error) {
      console.error('Cloudflare get domain info error:', error);
      return null;
    }
  }

  // ===== R2 STORAGE API =====

  private static validateR2Credentials() {
    if (!CLOUDFLARE_R2_ENDPOINT || !CLOUDFLARE_R2_ACCESS_KEY_ID || 
        !CLOUDFLARE_R2_SECRET_ACCESS_KEY || !CLOUDFLARE_R2_BUCKET_NAME) {
      throw new Error('Cloudflare R2 credentials not configured');
    }
  }

  // Загрузить файл в R2 (прямая интеграция)
  static async uploadToR2(
    file: File,
    path: string
  ): Promise<{ url: string; size: number; fileName: string }> {
    this.validateR2Credentials();

    try {
      // Создаем S3 клиент для Cloudflare R2
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
      
      const r2Client = new S3Client({
        region: 'auto',
        endpoint: CLOUDFLARE_R2_ENDPOINT!,
        credentials: {
          accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID!,
          secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
        },
      });

      // Конвертируем File в Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Загружаем файл
      const putCommand = new PutObjectCommand({
        Bucket: CLOUDFLARE_R2_BUCKET_NAME!,
        Key: path,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream',
        Metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      });

      await r2Client.send(putCommand);

      const publicUrl = `${CLOUDFLARE_R2_PUBLIC_URL}/${path}`;

      return {
        url: publicUrl,
        size: file.size,
        fileName: file.name
      };
    } catch (error) {
      console.error('Cloudflare R2 upload error:', error);
      throw error;
    }
  }

  // Удалить файл из R2 (прямая интеграция)
  static async deleteFromR2(path: string): Promise<boolean> {
    this.validateR2Credentials();

    try {
      // Создаем S3 клиент для Cloudflare R2
      const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      
      const r2Client = new S3Client({
        region: 'auto',
        endpoint: CLOUDFLARE_R2_ENDPOINT!,
        credentials: {
          accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID!,
          secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
        },
      });

      // Удаляем файл
      const deleteCommand = new DeleteObjectCommand({
        Bucket: CLOUDFLARE_R2_BUCKET_NAME!,
        Key: path,
      });

      await r2Client.send(deleteCommand);

      return true;
    } catch (error) {
      console.error('Cloudflare R2 delete error:', error);
      throw error;
    }
  }

  // Получить публичный URL файла
  static getR2PublicUrl(path: string): string {
    if (!CLOUDFLARE_R2_PUBLIC_URL) {
      throw new Error('Cloudflare R2 public URL not configured');
    }
    return `${CLOUDFLARE_R2_PUBLIC_URL}/${path}`;
  }
}
