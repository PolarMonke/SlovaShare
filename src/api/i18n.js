import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
      translation: {
        "searchPlaceholder": "Search...",
        
      }
    },
    be: {
      translation: {
        "searchPlaceholder": "Пошук...",
        
      }
    }
  };

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', 
    debug: process.env.NODE_ENV === 'development', 
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;