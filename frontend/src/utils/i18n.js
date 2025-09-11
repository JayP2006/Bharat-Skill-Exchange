import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to BharatSkill Connect',
          findGurus: 'Find Gurus',
        }
      },
      hi: {
        translation: {
          welcome: 'भारतस्किल कनेक्ट में आपका स्वागत है',
          findGurus: 'गुरु खोजें',
        }
      }
    }
  });

export default i18n;