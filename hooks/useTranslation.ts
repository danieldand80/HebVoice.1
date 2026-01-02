'use client'

import { useState, useEffect } from 'react'
import { translations, Language, TranslationKey } from '@/lib/translations'

export function useTranslation() {
  const [lang, setLang] = useState<Language>('he')

  useEffect(() => {
    const savedLang = (localStorage.getItem('language') || 'he') as Language
    setLang(savedLang)
  }, [])

  const t = (key: TranslationKey): string => {
    return translations[lang][key]
  }

  return { t, lang }
}

