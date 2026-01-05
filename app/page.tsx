'use client'

import { useState } from 'react'
import { Volume2, Zap, Shield, Globe } from 'lucide-react'
import AuthButton from '@/components/AuthButton'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageToggle from '@/components/LanguageToggle'
import { useTranslation } from '@/hooks/useTranslation'

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
            <AuthButton />
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
          
          <AuthButton />
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
  const [showLoginWarning, setShowLoginWarning] = useState(false)
  const { t } = useTranslation()

  const handleCreateVoice = () => {
    setShowLoginWarning(true)
    setTimeout(() => setShowLoginWarning(false), 3000)
  }

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-32 p-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-purple-500 focus:outline-none"
        placeholder={t('placeholder')}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="flex gap-4">
        <select className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-purple-500 focus:outline-none">
          <option>Voice 1 - Male</option>
          <option>Voice 2 - Female</option>
          <option>Voice 3 - Young</option>
        </select>
        
        <select className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-purple-500 focus:outline-none">
          <option>Normal Speed</option>
          <option>Slow Speed</option>
          <option>Fast Speed</option>
        </select>
      </div>

      {showLoginWarning && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 text-center font-medium">
            ⚠️ {t('pleaseLogin')}
          </p>
        </div>
      )}
      
      <button 
        onClick={handleCreateVoice}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
        disabled={!text.trim()}
      >
        {t('createVoice')}
      </button>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {t('loginToSave')}
      </p>
    </div>
  )
}

