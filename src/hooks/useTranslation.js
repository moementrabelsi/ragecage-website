import { useLanguage } from '../contexts/LanguageContext'
import enTranslations from '../translations/en.json'
import frTranslations from '../translations/fr.json'

const translations = {
  en: enTranslations,
  fr: frTranslations,
}

export const useTranslation = () => {
  const { language } = useLanguage()

  const t = (key, options = {}) => {
    const keys = key.split('.')
    let value = translations[language]

    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`)
        return key
      }
    }

    return value
  }

  // Helper to render HTML translations
  const tHTML = (key) => {
    const text = t(key)
    if (typeof text === 'string' && text.includes('<strong>')) {
      return { __html: text }
    }
    return text
  }

  return { t, tHTML, language }
}

