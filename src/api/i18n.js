import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
      translation: {
        "SearchPlaceholder": "Search...",

        "All rights reserved": "All rights stolen by MCE",

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
        "Profile Image URL": "Profile Image URL",
        "Save Changes": "Save Changes",
        "Cancel": "Cancel",
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
        "Profile Image URL": "URL фота профілю",
        "Save Changes": "Захаваць змены",
        "Cancel": "Скасаваць",
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