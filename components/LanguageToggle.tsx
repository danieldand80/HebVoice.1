'use client'

import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'

export default function LanguageToggle() {
  const [lang, setLang] = useState<'he' | 'en'>('he')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'he' | 'en' || 'he'
    setLang(savedLang)
    document.documentElement.lang = savedLang
    document.documentElement.dir = savedLang === 'he' ? 'rtl' : 'ltr'
  }, [])

  const toggleLanguage = () => {
    const newLang = lang === 'he' ? 'en' : 'he'
    setLang(newLang)
    localStorage.setItem('language', newLang)
    document.documentElement.lang = newLang
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr'
    window.location.reload() // Reload to apply translations
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      aria-label="Toggle language"
    >
      <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {lang === 'he' ? 'EN' : 'HE'}
      </span>
    </button>
  )
}




