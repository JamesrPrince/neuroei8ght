// i18n/utils.js - Utilities for internationalization
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  FALLBACKS,
  FORMATTING_CONFIG,
} from './config'

// Safely check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined'

// Get user preferred language from browser or localStorage
export function getUserPreferredLanguage() {
  if (!isBrowser()) return DEFAULT_LANGUAGE

  // Check localStorage first
  try {
    const storedLang = localStorage.getItem('preferredLanguage')
    if (storedLang && LANGUAGES[storedLang]) {
      return storedLang
    }

    // Try to detect from browser settings
    if (window.navigator.languages && window.navigator.languages.length) {
      for (const langCode of window.navigator.languages) {
        const lang = langCode.split('-')[0] // e.g. "en-US" -> "en"
        if (LANGUAGES[lang]) {
          return lang
        }
      }
    }
  } catch (error) {
    console.error('Error accessing browser APIs:', error)
  }

  return DEFAULT_LANGUAGE
}

// Save user's language preference
export function saveLanguagePreference(langCode) {
  if (isBrowser()) {
    try {
      localStorage.setItem('preferredLanguage', langCode)
    } catch (error) {
      console.error('Error saving language preference:', error)
    }
  }
}

// Load translations for a specific language
export async function loadTranslations(langCode) {
  try {
    // Dynamic import based on language code
    const module = await import(`./locales/${langCode}/translation.json`)
    return module.default || {}
  } catch (error) {
    console.warn(`Failed to load translations for ${langCode}:`, error)

    // If there's a fallback language, try to load that
    if (FALLBACKS[langCode]) {
      try {
        const fallbackModule = await import(
          `./locales/${FALLBACKS[langCode]}/translation.json`
        )
        return fallbackModule.default || {}
      } catch (fallbackError) {
        console.error(`Failed to load fallback translations:`, fallbackError)
      }
    }

    // Return empty object if all fails
    return {}
  }
}

// Translation function using dot notation for nested keys
export function t(translations, key, replacements = {}) {
  // Handle nested keys with dot notation (e.g. "common.buttons.submit")
  const keys = key.split('.')
  let value = translations

  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }

  // If key not found, return the key itself as fallback
  if (typeof value !== 'string') {
    console.warn(`Translation missing for key: ${key}`)
    return key
  }

  // Replace placeholders like {{name}} with values from replacements
  return value.replace(/\{\{(\w+)\}\}/g, (_, placeholder) => {
    return replacements[placeholder] !== undefined
      ? replacements[placeholder]
      : `{{${placeholder}}}`
  })
}

// Format date according to locale
export function formatDate(date, locale = 'en-US', formatType = 'medium') {
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    const formattingOptions =
      FORMATTING_CONFIG[locale]?.date?.[formatType] || {}

    return new Intl.DateTimeFormat(locale, formattingOptions).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', error)
    return date
  }
}

// Format number according to locale
export function formatNumber(number, locale = 'en-US') {
  try {
    return new Intl.NumberFormat(locale).format(number)
  } catch (error) {
    console.error('Error formatting number:', error)
    return number
  }
}

// Format currency according to locale
export function formatCurrency(amount, locale = 'en-US') {
  try {
    const options = FORMATTING_CONFIG[locale]?.currency || {
      style: 'currency',
      currency: 'USD',
    }
    return new Intl.NumberFormat(locale, options).format(amount)
  } catch (error) {
    console.error('Error formatting currency:', error)
    return amount
  }
}

// Get language direction (RTL or LTR)
export function getLanguageDirection(langCode) {
  // RTL languages (add more as needed)
  const rtlLanguages = ['ar', 'he', 'ur', 'fa']
  return rtlLanguages.includes(langCode) ? 'rtl' : 'ltr'
}

// Get browser language for initial detection
export function getBrowserLanguage() {
  if (!isBrowser()) return DEFAULT_LANGUAGE

  try {
    // Get browser language
    const browserLang =
      window.navigator.language || window.navigator.userLanguage
    if (!browserLang) return DEFAULT_LANGUAGE

    // Extract the base language code (e.g., "en-US" -> "en")
    const baseLang = browserLang.split('-')[0]

    // Check if it's one of our supported languages
    return LANGUAGES[baseLang] ? baseLang : DEFAULT_LANGUAGE
  } catch (error) {
    console.error('Error detecting browser language:', error)
    return DEFAULT_LANGUAGE
  }
}

// Get all available languages
export function getAvailableLanguages() {
  return Object.values(LANGUAGES)
}
