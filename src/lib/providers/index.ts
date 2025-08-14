// Экспорт всех провайдеров
export { supabase } from './supabase';
export { NamecheapProvider } from './namecheap';
export { CloudflareProvider } from './cloudflare';

// Типы
export type { 
  NamecheapDomainCheck, 
  NamecheapDomainPurchaseRequest, 
  NamecheapDomainPurchaseResponse 
} from './namecheap';

export type { 
  CloudflareDomain, 
  CloudflareDomainSearchResponse, 
  CloudflareDomainPurchaseRequest, 
  CloudflareDomainPurchaseResponse, 
  CloudflareDNSRecord 
} from './cloudflare';
