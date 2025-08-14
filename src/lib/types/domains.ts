// Типы для работы с доменами

export interface DomainSearchResult {
  domain: string;
  available: boolean;
  price?: number;
  premiumPrice?: number;
  isPremium?: boolean;
  provider: 'namecheap' | 'cloudflare';
}

export interface DomainPurchaseRequest {
  domain: string;
  price: number;
  userId: string;
  provider: 'namecheap' | 'cloudflare';
  registrant?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
  };
}

export interface DomainPurchaseResult {
  success: boolean;
  transactionId?: string;
  domain?: string;
  expiryDate?: string;
  error?: string;
}

export interface DomainInfo {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'error' | 'expired';
  provider: 'namecheap' | 'cloudflare';
  purchaseDate: string;
  expiryDate: string;
  autoRenew: boolean;
  privacy: boolean;
  dnsConfigured: boolean;
}

export interface DomainDNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'SRV';
  name: string;
  content: string;
  ttl: number;
  proxied?: boolean;
}

export interface DomainRegistrant {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  organization?: string;
}
