// Упрощенный интерфейс для списка PWA (без избыточных данных)
export interface PWAListItem {
  id: string;
  name: string;
  title: string;
  domain: string;
  status: 'active' | 'paused' | 'draft';
  language: string;
  installs: number;
  ftds?: number;        // First Time Deposits
  cr?: number;          // Conversion Rate
  favorite?: boolean;   // Избранное PWA
  rating?: number;
  logo_url?: string;   // URL логотипа для превью
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// Основные типы для PWA системы
export interface PWAProject {
  id: string;
  user_id: string;     // Изменено обратно с creator_id на user_id
  
  // Локализация и основная информация
  language: string;    // Язык PWA
  name: string;        // Название
  title: string;       // Заголовок описания
  description?: string; // Описание
  
  // Метрики и взаимодействие
  rating?: number;     // Рейтинг (0-5.0)
  comments: any[];     // Комментарии (JSONB массив)
  installs: number;    // Количество установок
  favorite?: boolean;  // Избранное PWA
  
  // Изображения
  logo_url?: string;   // URL логотипа
  screenshots: string[]; // Массив URL скриншотов
  
  // Медиафайлы (legacy, возможно удалить в будущем)
  media_files: {       // Медиафайлы (JSONB)
    icons: any[];
    screenshots: any[];
    videos: any[];
    assets: any[];
    banners: any[];
  };
  
  // Доменная настройка и трафик
  domain: string;      // Домен
  traffic_url?: string; // URL для запуска трафика с сабами
  
  // Статус проекта
  status: 'active' | 'paused' | 'draft';
  
  // Дополнительные настройки
  icon_url?: string;   // URL основной иконки
  
  // Временные метки
  created_at: string;
  updated_at: string;
  published_at?: string;
  last_modified_at: string;
}

export interface PWAMetrics {
  clicks: number;           // Клики по объявлению/ссылке
  click2inst: number;       // Процент кликов идущих в установку (%)
  installs: number;         // Установки приложения
  ftds: number;             // First Time Deposits / Первые депозиты
  cr: number;               // Conversion Rate: % инсталлов идущих в депозит (%)
  last_updated: string;     // Последнее обновление метрик
}

export interface PWAManifest {
  name: string;
  description: string;
  start_url: string;
  display: string;
  orientation: string;
  icons: PWAIcon[];
  screenshots?: PWAScreenshot[];
  categories?: string[];
  lang: string;
  scope: string;
}

export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable' | 'monochrome';
}

export interface PWAScreenshot {
  src: string;
  sizes: string;
  type: string;
  form_factor?: 'wide' | 'narrow';
  label?: string;
}

export interface PWADomain {
  id: string;
  pwa_id: string;
  domain: string;
  is_custom: boolean;
  ssl_enabled: boolean;
  status: 'pending' | 'active' | 'error';
  created_at: string;
}

// Для создания/редактирования PWA
export interface CreatePWARequest {
  name: string;
  title: string;
  description?: string;
  language: string;
  domain: string;
  traffic_url?: string;
}

export interface UpdatePWARequest extends Partial<CreatePWARequest> {
  id: string;
}
