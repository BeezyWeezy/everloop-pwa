// Конфигурация для разных провайдеров хранилища
import { supabase } from './supabaseClient';

export interface StorageProvider {
  name: string;
  uploadFile: (path: string, file: File) => Promise<{ url: string; error?: string }>;
  deleteFile: (path: string) => Promise<{ success: boolean; error?: string }>;
  getPublicUrl: (path: string) => string;
}

interface BaseStorageConfig {
  freeLimit: number; // MB
  pricePerGB: number;
  trafficPerGB: number;
  monthlyPlan: number;
  freePlanTrafficGB: number;
  freePlanStorageGB: number;
}

interface AWSStorageConfig extends BaseStorageConfig {
  requestsPer1000: number;
  retrievalsPer1000: number;
  cloudFrontPerGB: number;
}

// Supabase Storage Provider
export const supabaseStorageProvider: StorageProvider = {
  name: 'supabase',
  uploadFile: async (path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from('pwa-assets')
      .upload(path, file);
    
    if (error) return { url: '', error: error.message };
    
    const { data: urlData } = supabase.storage
      .from('pwa-assets')
      .getPublicUrl(path);
    
    return { url: urlData.publicUrl };
  },
  deleteFile: async (path: string) => {
    const { error } = await supabase.storage
      .from('pwa-assets')
      .remove([path]);
    
    return { success: !error, error: error?.message };
  },
  getPublicUrl: (path: string) => {
    const { data } = supabase.storage
      .from('pwa-assets')
      .getPublicUrl(path);
    return data.publicUrl;
  }
};

// Cloudflare R2 Provider (для будущего использования)
export const cloudflareR2Provider: StorageProvider = {
  name: 'cloudflare',
  uploadFile: async (path: string, file: File) => {
    // Реализация для Cloudflare R2
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`/api/upload/cloudflare?path=${path}`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    return { url: result.url, error: result.error };
  },
  deleteFile: async (path: string) => {
    const response = await fetch(`/api/delete/cloudflare?path=${path}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    return { success: result.success, error: result.error };
  },
  getPublicUrl: (path: string) => {
    return `https://pub-your-r2-domain.r2.dev/${path}`;
  }
};

// AWS S3 Provider
export const awsS3Provider: StorageProvider = {
  name: 'aws-s3',
  uploadFile: async (path: string, file: File) => {
    // Реализация для AWS S3
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`/api/upload/aws-s3?path=${path}`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    return { url: result.url, error: result.error };
  },
  deleteFile: async (path: string) => {
    const response = await fetch(`/api/delete/aws-s3?path=${path}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    return { success: result.success, error: result.error };
  },
  getPublicUrl: (path: string) => {
    return `https://your-bucket.s3.amazonaws.com/${path}`;
  }
};

// Текущий провайдер (можно переключать через переменную окружения)
export const currentStorageProvider = (() => {
  const provider = process.env.NEXT_PUBLIC_STORAGE_PROVIDER;
  switch (provider) {
    case 'cloudflare': return cloudflareR2Provider;
    case 'aws-s3': return awsS3Provider;
    default: return supabaseStorageProvider;
  }
})();

// Расчет стоимости хранения
export const STORAGE_COSTS = {
  supabase: {
    freeLimit: 1024, // MB
    pricePerGB: 0.021, // после лимита
    trafficPerGB: 0.09,
    monthlyPlan: 25, // Pro план
    freePlanTrafficGB: 200,
    freePlanStorageGB: 100,
  } as BaseStorageConfig,
  cloudflare: {
    freeLimit: 10240, // MB  
    pricePerGB: 0.015,
    trafficPerGB: 0, // бесплатный!
    monthlyPlan: 0,
    freePlanTrafficGB: Infinity,
    freePlanStorageGB: 10,
  } as BaseStorageConfig,
  'aws-s3': {
    freeLimit: 0, // нет бесплатного плана для коммерческого использования
    pricePerGB: 0.023, // Standard Storage
    trafficPerGB: 0.09, // CloudFront
    monthlyPlan: 0,
    freePlanTrafficGB: 0,
    freePlanStorageGB: 0,
    // Дополнительные расходы AWS
    requestsPer1000: 0.0004, // PUT, COPY, POST, LIST requests
    retrievalsPer1000: 0.0004, // GET, SELECT requests
    cloudFrontPerGB: 0.085, // CDN
  } as AWSStorageConfig
};

export function calculateStorageCost(
  provider: keyof typeof STORAGE_COSTS,
  storageGB: number,
  trafficGB: number,
  monthlyRequests = 100000 // примерное количество запросов
) {
  const config = STORAGE_COSTS[provider];
  const storageMB = storageGB * 1024;
  
  if (provider === 'supabase') {
    if (storageGB <= config.freePlanStorageGB && trafficGB <= config.freePlanTrafficGB) {
      return config.monthlyPlan; // Pro план покрывает
    }
    return config.monthlyPlan + 
           Math.max(0, storageGB - config.freePlanStorageGB) * config.pricePerGB +
           Math.max(0, trafficGB - config.freePlanTrafficGB) * config.trafficPerGB;
  }
  
  if (provider === 'cloudflare') {
    if (storageMB <= config.freeLimit) {
      return 0;
    }
    return (storageMB - config.freeLimit) / 1024 * config.pricePerGB;
  }
  
  if (provider === 'aws-s3') {
    const awsConfig = config as AWSStorageConfig;
    let cost = 0;
    
    // Стоимость хранения
    cost += storageGB * awsConfig.pricePerGB;
    
    // Стоимость трафика (через CloudFront CDN)
    cost += trafficGB * awsConfig.cloudFrontPerGB;
    
    // Стоимость запросов
    const requests1000 = monthlyRequests / 1000;
    cost += requests1000 * awsConfig.requestsPer1000;
    cost += requests1000 * awsConfig.retrievalsPer1000;
    
    return cost;
  }
  
  return 0;
}
