import { describe, it, expect } from 'vitest'
import { getLanguageDirection, getAvailableLanguages } from './utils'

describe('i18n utils', () => {
  it('should return ltr for English', () => {
    expect(getLanguageDirection('en')).toBe('ltr')
  })

  it('should return rtl for Arabic', () => {
    expect(getLanguageDirection('ar')).toBe('rtl')
  })

  it('should list available languages', () => {
    const langs = getAvailableLanguages()
    expect(Array.isArray(langs)).toBe(true)
    expect(langs.some((l) => l.code === 'en')).toBe(true)
  })
})
