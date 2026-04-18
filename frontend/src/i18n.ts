import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptTranslations from './locales/pt.json';
import enTranslations from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: ptTranslations },
      en: { translation: enTranslations }
    },
    lng: 'pt', // Idioma padrão inicial
    fallbackLng: 'en', // Se faltar alguma palavra no PT, ele usa o EN
    interpolation: {
      escapeValue: false // O React já protege contra XSS de forma nativa
    }
  });

export default i18n;