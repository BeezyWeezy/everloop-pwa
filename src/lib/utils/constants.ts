// Константы приложения

// Статусы PWA
export const PWA_STATUSES = {
  DRAFT: 'draft',
  BUILDING: 'building',
  READY: 'ready',
  DEPLOYED: 'deployed',
  PAUSED: 'paused',
  ERROR: 'error',
  ARCHIVED: 'archived'
} as const;

// Категории PWA
export const PWA_CATEGORIES = [
  'Casino',
  'Sports Betting',
  'Poker',
  'Slots',
  'Live Casino',
  'Bingo',
  'Lottery',
  'Other'
] as const;

// Языки
export const LANGUAGES = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'pl', label: 'Polski' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'ar', label: 'العربية' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' }
] as const;

// Ограничения файлов
export const FILE_LIMITS = {
  ICON: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/x-icon'],
    REQUIRED_SIZES: [192, 512]
  },
  SCREENSHOT: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/webp'],
    MAX_COUNT: 8
  },
  VIDEO: {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_TYPES: ['video/mp4', 'video/webm'],
    MAX_DURATION: 30 // секунд
  },
  ASSET: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/webp']
  }
} as const;

// Популярные TLD для поиска доменов
export const POPULAR_TLDS = [
  'com', 'net', 'org', 'site', 'online', 'app', 'io', 'co', 'me', 'tv',
  'cc', 'ws', 'casino', 'bet', 'games', 'club', 'vip', 'xyz', 'top', 'win'
] as const;

// Дешевые TLD
export const CHEAP_TLDS = [
  'tk', 'ml', 'ga', 'cf', 'xyz', 'top', 'win', 'bid', 'trade', 'science'
] as const;

// Цвета темы
export const THEME_COLORS = {
  PRIMARY: '#F5BE37',
  SECONDARY: '#6366f1',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6'
} as const;

// Размеры экранов
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

// API endpoints
export const API_ENDPOINTS = {
  DOMAINS: {
    SEARCH: '/api/domains/search',
    PURCHASE: '/api/domains/purchase'
  },
  UPLOAD: {
    CLOUDFLARE: '/api/upload/cloudflare',
    PRESIGN: '/api/upload/presign-cloudflare'
  },
  DELETE: {
    CLOUDFLARE: '/api/delete/cloudflare'
  }
} as const;

// Локальные ключи для localStorage
export const STORAGE_KEYS = {
  THEME: 'everloop-theme',
  LANGUAGE: 'everloop-language',
  USER_PREFERENCES: 'everloop-user-preferences'
} as const;

// Временные интервалы (в миллисекундах)
export const TIME_INTERVALS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000
} as const;

// Максимальные значения
export const MAX_VALUES = {
  DOMAIN_LENGTH: 63,
  PASSWORD_LENGTH: 128,
  EMAIL_LENGTH: 254,
  TITLE_LENGTH: 100,
  DESCRIPTION_LENGTH: 500,
  NAME_LENGTH: 50
} as const;
