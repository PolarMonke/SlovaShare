import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
      translation: {
        "Search Placeholder": "Search...",
        "Loading...": "Loading...",
        "Loading Stories...": "Loading Stories...",

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
        "Your Contributions":"Your Contributions",
        "Contributions":"Contributions",
        "Published Stories": "Published Stories",
        "No stories published yet": "No stories published yet",
        "No stories contributed yet": "No stories contributed yet",

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

        "Create New Story": "Create New Story",
        "Title": "Title",
        "Give your story a title": "Give your story a title",
        "Description": "Description",
        "Briefly describe your story": "Briefly describe your story",
        "Your Story": "Your Story",
        "Write the beginning of your story here...": "Write the beginning of your story here...",
        "Tags": "Tags",
        "Add tags to help readers find your story": "Add tags to help readers find your story",
        "Add up to 5 tags that describe your story": "Add up to 5 tags that describe your story",
        "Cover Image": "Cover Image",
        "Upload a cover image (optional)": "Upload a cover image (optional)",
        "JPEG, PNG or GIF. Max 5MB.": "JPEG, PNG or GIF. Max 5MB.",
        "Browse Files": "Browse Files",
        "Change Image": "Change Image",
        "Remove": "Remove",
        "Public Story": "Public Story",
        "Private Story": "Private Story",
        "Anyone can view and contribute to this story": "Anyone can view and contribute to this story",
        "Only you can view and contribute to this story": "Only you can view and contribute to this story",
        "Publish Story": "Publish Story",
        "Publishing...": "Publishing...",
        "Invalid file type. Only JPEG, PNG, GIF allowed.": "Invalid file type. Only JPEG, PNG, GIF allowed.",
        "File too large (max 5MB)": "File too large (max 5MB)",
        "Upload failed. Please try again.": "Upload failed. Please try again.",
        "Failed to create story. Please try again.": "Failed to create story. Please try again.",
        "Remove tag": "Remove tag",
        "Invalid file type. Only JPEG, PNG, GIF, WEBP allowed.": "Invalid file type. Only JPEG, PNG, GIF, WEBP allowed.",
        "JPEG, PNG, GIF or WEBP. Max 5MB.": "JPEG, PNG, GIF or WEBP. Max 5MB.",
        
        "Loading Stories..." : "Loading Stories...",
        "Latest Stories": "Latest Stories",
        "Your Stories": "Your Stories",
        "By": "By",
        "parts": "parts",
        "No description available": "No description available",

        "Story Parts": "Story Parts",
        "Comments": "Comments",
        "Delete": "Delete",
        "No comments yet": "No comments yet",
        "Post Comment": "Post Comment",
        "Part": "Part",
        "Write your comment here...": "Write your comment here...",
        "Reply": "Reply",
        "Add Part": "Add Part",
        "Write your part here...": "Write your part here...",
        "Submit Part": "Submit Part",

        "Edit Story": "Edit Story",
        "": "",

        "Search Results": "Search Results",
        "No results found": "No results found",
        "Previous": "Previous",
        "Next": "Next",

        "Story Contributions": "Story Contributions",
        "Jan": "Jan","Feb": "Feb","Mar": "Mar","Apr": "Apr","May": "May","Jun": "Jun","Jul": "Jul","Aug": "Aug","Sep": "Sep","Oct": "Oct","Nov": "Nov","Dec": "Dec",
        "Less": "Less","More": "More",

      }
    },
    be: {
      translation: {
        "Search Placeholder": "Пошук...",
        "Loading...": "Загрузка...",
        "Loading Stories...": "Загрузка апавяданняў...",


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
        "Your Contributions":"Вашыя ўклады",
        "Contributions":"Уклады",
        "Published Stories": "Апавяданні",
        "No stories published yet": "Няма апублікаваных апавяданняў",
        "No stories contributed yet": "Няма ўкладаў у апавяданні",
        

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

        "Create New Story": "Стварыць новае апавяданне",
        "Title": "Назва",
        "Give your story a title": "Дайте вашаму апавяданню назву",
        "Description": "Апісанне",
        "Briefly describe your story": "Коратка апішыце вашае апавяданне",
        "Your Story": "Ваша гісторыя",
        "Write the beginning of your story here...": "Напішыце пачатак вашага апавядання тут...",
        "Tags": "Тэгі",
        "Add tags to help readers find your story": "Дадайце тэгі, каб дапамагчы чытачам знайсці вашае апавяданне",
        "Add up to 5 tags that describe your story": "Дадайце да 5 тэгаў, якія апісваюць вашае апавяданне",
        "Cover Image": "Вокладка",
        "Upload a cover image (optional)": "Загрузіце выяву для вокладкі (неабавязкова)",
        "JPEG, PNG or GIF. Max 5MB.": "JPEG, PNG ці GIF. Максімум 5MB.",
        "Browse Files": "Абраць файл",
        "Change Image": "Змяніць выяву",
        "Remove": "Выдаліць",
        "Public Story": "Публічнае апавяданне",
        "Private Story": "Прыватнае апавяданне",
        "Anyone can view and contribute to this story": "Усе могуць праглядаць і дапаўняць гэтае апавяданне",
        "Only you can view and contribute to this story": "Толькі вы можаце праглядаць і дапаўняць гэтае апавяданне",
        "Publish Story": "Апублікаваць апавяданне",
        "Publishing...": "Публікуецца...",
        "Invalid file type. Only JPEG, PNG, GIF allowed.": "Няправільны тып файла. Дазваляюцца толькі JPEG, PNG, GIF.",
        "File too large (max 5MB)": "Файл занадта вялікі (максімум 5MB)",
        "Upload failed. Please try again.": "Не ўдалося загрузіць. Паспрабуйце яшчэ раз.",
        "Failed to create story. Please try again.": "Не ўдалося стварыць апавяданне. Паспрабуйце яшчэ раз.",
        "Remove tag": "Выдаліць тэг",
        "Invalid file type. Only JPEG, PNG, GIF, WEBP allowed.": "Няправільны тып файла. Дазваляюцца толькі JPEG, PNG, GIF, WEBP.",
        "JPEG, PNG, GIF or WEBP. Max 5MB.": "JPEG, PNG, GIF ці WEBP. Максімум 5MB.",
        
        "Loading Stories..." : "Апавяданні загружаюцца...",
        "Latest Stories": "Апошнія апавяданні",
        "Your Stories": "Вашыя апавяданні",
        "By": "Ад",
        "parts": "частак",
        "No description available": "Без апісання", 

        "Story Parts": "Часткі апавядання",
        "Comments": "Каментарыі",
        "Delete": "Выдаліць",
        "No comments yet": "Пакуль няма каментарыяў",
        "Post Comment": "Апублікаваць каментарый",
        "Part": "Частка",
        "Write your comment here...": "Напішыце сюды свой каментарый...",
        "Reply": "Адказаць",
        "Add Part": "Дадаць частку",
        "Write your part here...": "Напішыце сваю частку...",
        "Submit Part": "Апублікаваць",

        "Edit Story": "Рэдагаванне апавядання",

        "Search Results": "Рэзультаты пошуку",
        "No results found": "Нічога не знойдзена",
        "Previous": "Мінулая",
        "Next": "Наступная",

        "": "",

        "Story Contributions": "Актыўнасць",
        "Jan": "Сту","Feb": "Лют","Mar": "Сак","Apr": "Кра","May": "Тра","Jun": "Чэр","Jul": "Ліп","Aug": "Жні","Sep": "Вер","Oct": "Кас","Nov": "Ліс","Dec": "Сне",
        "Less": "Менш","More": "Больш",

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