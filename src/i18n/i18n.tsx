import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './en.json';
import it from './it.json';

// Configure resources with imported JSON files
const resources = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
};

// Load the saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage, // Set the initial language
  fallbackLng: 'en', // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  detection: {
    // Optionally configure language detection (if using a detection plugin)
  },
});

// Listen for language changes and save the selected language to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;