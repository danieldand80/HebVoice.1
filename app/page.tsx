'use client'

import { useState, useEffect } from 'react'
import { Volume2, Zap, Shield, Globe } from 'lucide-react'
import AuthSection from '@/components/AuthSection'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageToggle from '@/components/LanguageToggle'
import { useTranslation } from '@/hooks/useTranslation'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Volume2 className="text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              HebVoice
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <AuthSection />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t('subtitle')}
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">
            {t('description')}
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-purple-600" />}
            title={t('fastSimple')}
            description={t('fastSimpleDesc')}
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-purple-600" />}
            title={t('highQuality')}
            description={t('highQualityDesc')}
          />
          <FeatureCard
            icon={<Globe className="w-12 h-12 text-purple-600" />}
            title={t('hebrewSupport')}
            description={t('hebrewSupportDesc')}
          />
        </div>

        {/* Demo Section */}
        <div className="mt-20 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">{t('tryNow')}</h2>
          <DemoForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 mt-20">
        <p>{t('rights')}</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

function DemoForm() {
  const [text, setText] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    // Check auth status
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleCreateVoice = () => {
    window.location.href = '/dashboard'
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // If not authenticated - show login message
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          {t('toGenerateVoice')}
        </p>
        <AuthSection />
      </div>
    )
  }

  // If authenticated - show dashboard button
  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <div className="inline-block p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
          <p className="text-green-800 dark:text-green-200 font-medium">
            ✓ {t('loggedInMessage')}
          </p>
        </div>
      </div>
      <button
        onClick={handleCreateVoice}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-medium rounded-full hover:shadow-xl transition transform hover:scale-105"
      >
        {t('goToDashboard')} →
      </button>
    </div>
  )
}

