import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Импортируем модульные переводы
import { en } from './locales/en';
import { ru } from './locales/ru';
import { uk } from './locales/uk';

// Локальные переводы (для обратной совместимости)
const legacyResources = {
    en: {
        translation: en
    },
    ru: {
        translation: ru
    },
    uk: {
        translation: uk
    },
    ua: {
        translation: uk  // Альтернативный код для украинского языка
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: legacyResources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        
        interpolation: {
            escapeValue: false,
        },
        
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
        
        react: {
            useSuspense: false,
        },
    });

export default i18n;
