# Система переводов Everloop

## Структура

```
src/i18n/
├── locales/
│   ├── en/                    # Английские переводы
│   │   ├── common.ts         # Общие переводы
│   │   ├── auth.ts           # Переводы для аутентификации
│   │   ├── pwa.ts            # Переводы для PWA модуля
│   │   └── index.ts          # Объединение всех переводов
│   ├── ru/                    # Русские переводы
│   │   ├── common.ts
│   │   ├── auth.ts
│   │   ├── pwa.ts
│   │   └── index.ts
│   └── [lang]/                # Другие языки
├── i18n.ts                    # Конфигурация i18next
├── LanguageSwitcher.tsx       # Компонент переключения языка
└── README.md                  # Этот файл
```

## Как добавить новый модуль переводов

1. **Создайте файл для каждого языка:**

```typescript
// src/i18n/locales/en/profile.ts
export const profile = {
  title: "Profile",
  editProfile: "Edit Profile",
  // ... другие переводы
};

// src/i18n/locales/ru/profile.ts
export const profile = {
  title: "Профиль",
  editProfile: "Редактировать профиль",
  // ... другие переводы
};
```

2. **Добавьте в индексные файлы:**

```typescript
// src/i18n/locales/en/index.ts
import { profile } from './profile';

export const en = {
  ...common,
  ...pwa,
  ...auth,
  ...profile, // Добавьте новый модуль
  // ... legacy keys
};

// src/i18n/locales/ru/index.ts
import { profile } from './profile';

export const ru = {
  ...common,
  ...pwa,
  ...auth,
  ...profile, // Добавьте новый модуль
  // ... legacy keys
};
```

## Как добавить новый язык

1. **Создайте папку для языка:**
```
src/i18n/locales/uk/
├── common.ts
├── auth.ts
├── pwa.ts
└── index.ts
```

2. **Добавьте в i18n.ts:**
```typescript
import { uk } from './locales/uk';

const legacyResources = {
  en: { translation: en },
  ru: { translation: ru },
  uk: { translation: uk }, // Добавьте новый язык
};
```

## Лучшие практики

### 1. **Организация по модулям**
- Разделяйте переводы по функциональным модулям
- Используйте вложенные объекты для группировки
- Называйте файлы по модулям: `auth.ts`, `pwa.ts`, `profile.ts`

### 2. **Именование ключей**
```typescript
// ✅ Хорошо
export const pwa = {
  creator: {
    title: "PWA Creator Pro",
    description: "Create professional PWAs",
    steps: {
      basic: "Basic Information",
      design: "Design & Branding"
    }
  }
};

// ❌ Плохо
export const pwa = {
  pwaCreatorTitle: "PWA Creator Pro",
  pwaCreatorDescription: "Create professional PWAs",
  pwaCreatorStepBasic: "Basic Information"
};
```

### 3. **Использование в компонентах**
```typescript
// ✅ Хорошо - используйте namespace
const { t } = useTranslation();
t('pwa.creator.title')
t('auth.signIn')

// ❌ Плохо - длинные ключи
t('pwaCreatorTitle')
```

### 4. **Плагирование**
```typescript
// ✅ Хорошо
t('daysAgo', { count: 5 }) // "5 дней назад"

// ❌ Плохо
t('daysAgo5')
```

## Альтернативные подходы

### 1. **JSON файлы** (для больших проектов)
```
locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   └── pwa.json
└── ru/
    ├── common.json
    ├── auth.json
    └── pwa.json
```

### 2. **Внешние сервисы** (для команд)
- **Crowdin** - популярная платформа для переводов
- **Lokalise** - с интеграцией с GitHub
- **Phrase** - с API для автоматизации

### 3. **База данных** (для динамических переводов)
```sql
CREATE TABLE translations (
  id SERIAL PRIMARY KEY,
  language VARCHAR(5),
  namespace VARCHAR(50),
  key VARCHAR(100),
  value TEXT,
  created_at TIMESTAMP
);
```

## Автоматизация

### 1. **Извлечение ключей**
```bash
# Установите i18next-parser
npm install i18next-parser

# Добавьте в package.json
{
  "scripts": {
    "extract-translations": "i18next-parser src --output locales"
  }
}
```

### 2. **Проверка переводов**
```bash
# Установите i18next-scanner
npm install i18next-scanner

# Сканируйте код на предмет отсутствующих переводов
npx i18next-scanner --config i18next-scanner.config.js
```

## Миграция с текущей системы

1. **Постепенно переносите переводы** в новые файлы
2. **Сохраняйте обратную совместимость** в index.ts
3. **Обновляйте компоненты** для использования новых ключей
4. **Удаляйте старые переводы** после полной миграции

## Мониторинг и аналитика

### 1. **Отслеживание отсутствующих переводов**
```typescript
// В development режиме
i18n.on('missingKey', (lng, ns, key, res) => {
  console.warn(`Missing translation: ${lng}.${ns}.${key}`);
});
```

### 2. **Статистика переводов**
```typescript
// Подсчет процента переведенных ключей
const getTranslationStats = () => {
  const enKeys = Object.keys(en).length;
  const ruKeys = Object.keys(ru).length;
  return (ruKeys / enKeys) * 100;
};
```
