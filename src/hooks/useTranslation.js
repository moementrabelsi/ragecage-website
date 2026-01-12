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

    // Support interpolation: replace {{variable}} with options values
    if (typeof value === 'string' && Object.keys(options).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        return options[varName] !== undefined ? options[varName] : match
      })
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

