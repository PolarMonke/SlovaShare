import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
      translation: {
        "Search Placeholder": "Search...",

        "All rights reserved": "All rights stolen by MCB",

        "You": "You",
        "About": "About",
        "No Description": "No description provided yet",
        "Statistics": "Statistics",
        "Stories Started": "Stories Started",
        "Stories Contributed": "Stories Contributed",
        "Likes Received": "Likes Recieved",
        "Edit Profile": "Edit Profile",
        "Log Out": "Log Out",

        "Username": "Username",
        "Email": "Email",
        "Description": "Description",
        "Description Placeholder": "Tell us about yourself...",
        "Profile Image URL": "Profile Image URL",
        "Save Changes": "Save Changes",
        "Cancel": "Cancel",
        
        "Preview" : "Preview",
        "Drag & drop image here" : "Drag & drop image here",
        "or" : "or",
        "Browse files" : "Browse files",
      }
    },
    be: {
      translation: {
        "Search Placeholder": "Пошук...",

        "All rights reserved": "Усе правы скраў МКП",
        
        "You": "Вы",
        "About": "Апісанне",
        "No Description": "Пакуль што без апісання",
        "Statistics": "Статыстыка",
        "Stories Started": "Пачатыя апавяданні",
        "Stories Contributed": "Удзел у апавяданнях",
        "Likes Received": "Атрыманыя лайкі",
        "Edit Profile": "Рэдагаваць профіль",
        "Log Out": "Выйсці",

        "Username": "Імя",
        "Email": "Электронная пошта",
        "Description": "Апісанне",
        "Description Placeholder": "Раскажыце пра сябе...",
        "Profile Image URL": "URL фота профілю",
        "Save Changes": "Захаваць змены",
        "Cancel": "Скасаваць",

        "Preview" : "Прэв'ю",
        "Drag & drop image here" : "Перацягніце выяву сюды",
        "or" : "або",
        "Browse files" : "Адкрыць файлы",
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