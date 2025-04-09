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
        "Profile Image": "Profile Image",
        "Save Changes": "Save Changes",
        "Cancel": "Cancel",
        
        "Preview" : "Preview",
        "Remove" : "Remove",
        "Drag & drop image here" : "Drag & drop image here",
        "or" : "or",
        "Browse files" : "Browse files",
        
        "Password In Use By User": "This password is already in use by {{login}}",
        "General Error": "Registration error",
        "Username is required": "Username is required",
        "Password is required": "Password is required",
        "Password must be at least 8 characters": "Password must be at least 8 characters",
        "Email is required": "Email is required",
        "Invalid email format": "Invalid email format",
        "Verification code is required": "Verification code is required",
        "Create Account": "Create Account",
        "Password": "Password",
        "Verification Code": "Verification Code",
        "Processing...": "Processing...",
        "Complete Registration": "Complete Registration",
        "Send Verification Code": "Send Verification Code",
        "Logging in...": "Logging in...",
        "Log In": "Log In",
        "Already have an account? Log In": "Already have an account? Log In",
        "Create New Account": "Create New Account",
        "Password In Use": "Password In Use",
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
        "Profile Image": "Фота профілю",
        "Save Changes": "Захаваць змены",
        "Cancel": "Скасаваць",

        "Preview" : "Прэв'ю",
        "Remove" : "Выдаліць",
        "Drag & drop image here" : "Перацягніце выяву сюды",
        "or" : "або",
        "Browse files" : "Адкрыць файлы",

        
        "Password In Use By User": "Гэты пароль ужо выкарыстоўваецца карыстальнікам {{login}}",
        "General Error": "Памылка рэгістрацыі",
        "Username is required": "Неабходны логін",
        "Password is required": "Неабходны пароль",
        "Password must be at least 8 characters": "Пароль мае быць як мінімум 8 сімвалаў у даўжыню",
        "Email is required": "Неабходная электронная пошта",
        "Invalid email format": "Няправільны фармат пошты",
        "Verification code is required": "Неабходны код пацвярджэння",
        "Password In Use": "Пароль ужо выкарыстоўваецца",
        "Create Account": "Стварыць акаўнт",
        "Password": "Пароль",
        "Verification Code": "Код пацвярджэння",
        "Processing...": "Апрацоўка...",
        "Complete Registration": "Скончыць рэгістрацыю",
        "Send Verification Code": "Адправіць код пацвярджэння",
        "Logging in...": "Уваход...",
        "Log In": "Увайсці",
        "Already have an account? Log In": "Ужо маеце акаўнт? Увайсці",
        "Create New Account": "Стварыць новы акаўнт",
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