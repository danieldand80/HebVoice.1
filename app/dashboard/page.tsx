'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, Download, History, Settings, LogOut, Play, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { VOICES, SPEEDS } from '@/lib/google-tts'
import { useTranslation } from '@/hooks/useTranslation'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageToggle from '@/components/LanguageToggle'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [voice, setVoice] = useState(VOICES[0].id)
  const [speed, setSpeed] = useState(SPEEDS[1].id)
  const [loading, setLoading] = useState(false)
  const [audioBase64, setAudioBase64] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    // Load history from sessionStorage
    const savedHistory = sessionStorage.getItem('tts_history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }

  const saveToHistory = (text: string, audioBase64: string, voice: string, speed: number) => {
    const newItem = {
      id: Date.now().toString(),
      text: text.substring(0, 100),
      audio_url: audioBase64,
      voice,
      speed,
      character_count: text.length,
      created_at: new Date().toISOString(),
    }
    
    const updatedHistory = [newItem, ...history]
    setHistory(updatedHistory)
    sessionStorage.setItem('tts_history', JSON.stringify(updatedHistory))
  }

  const handleGenerate = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setAudioBase64(null)

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice,
          speed,
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate speech')
      }

      if (result.success && result.audioBase64) {
        setAudioBase64(result.audioBase64)
        saveToHistory(text, result.audioBase64, voice, speed)
      } else {
        throw new Error('No audio generated')
      }
    } catch (error: any) {
      console.error('Error:', error)
      setError(error.message || 'שגיאה ביצירת הקול')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayAudio = () => {
    if (!audioBase64) return
    
    // Convert base64 to audio URL
    const audioBlob = new Blob(
      [Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))],
      { type: 'audio/mp3' }
    )
    const audioUrl = URL.createObjectURL(audioBlob)
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play()
    }
  }

  const handleDownload = () => {
    if (!audioBase64) return
    
    const audioBlob = new Blob(
      [Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))],
      { type: 'audio/mp3' }
    )
    const url = URL.createObjectURL(audioBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hebvoice-${Date.now()}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePlayHistoryAudio = (audioUrl: string) => {
    if (!audioUrl) return
    
    // Play from base64
    const audioBlob = new Blob(
      [Uint8Array.from(atob(audioUrl), c => c.charCodeAt(0))],
      { type: 'audio/mp3' }
    )
    const url = URL.createObjectURL(audioBlob)
    
    if (audioRef.current) {
      audioRef.current.src = url
      audioRef.current.play()
    }
  }

  const handleDownloadHistoryAudio = (audioUrl: string, id: string) => {
    if (!audioUrl) return
    
    const audioBlob = new Blob(
      [Uint8Array.from(atob(audioUrl), c => c.charCodeAt(0))],
      { type: 'audio/mp3' }
    )
    const url = URL.createObjectURL(audioBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hebvoice-${id}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xl font-bold dark:text-white">
              <Volume2 className="text-purple-600" />
              <span>HebVoice</span>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              >
                <LogOut size={20} />
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">{t('createNew')}</h2>
              
              <textarea
                className="w-full h-48 p-4 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:outline-none mb-2 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder={t('pasteText')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={5000}
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-left">
                {text.length} / 5000 {t('charactersCount')}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{t('selectVoice')}</label>
                  <select
                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:outline-none cursor-pointer"
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                  >
                    {VOICES.map(v => (
                      <option key={v.id} value={v.id} className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{t('selectSpeed')}</label>
                  <select
                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:outline-none cursor-pointer"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                  >
                    {SPEEDS.map(s => (
                      <option key={s.id} value={s.id} className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !text.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {t('generating')}
                  </>
                ) : (
                  t('createVoice')
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                  {error}
                </div>
              )}

              {audioBase64 && !error && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-800 dark:text-green-200 font-medium">{t('success')} 🎉</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handlePlayAudio}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Play size={20} />
                      {t('play')}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      <Download size={20} />
                      {t('download')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2 dark:text-white">
                <History size={24} />
                {t('history')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {t('historyNote')}
              </p>

              <div className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    {t('noVoicesYet')}
                  </p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
                    >
                      <p className="text-sm font-medium truncate mb-2 text-gray-900 dark:text-gray-200">
                        {item.text || 'No text'}
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(item.created_at).toLocaleDateString('he-IL')}
                        </p>
                        <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                          {item.character_count} {t('characters')}
                        </p>
                      </div>
                      {item.audio_url && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handlePlayHistoryAudio(item.audio_url)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                          >
                            <Play size={14} />
                            {t('play')}
                          </button>
                          <button
                            onClick={() => handleDownloadHistoryAudio(item.audio_url, item.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                          >
                            <Download size={14} />
                            {t('download')}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                <Settings size={24} />
                {t('statistics')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">{t('voicesCreated')}</span>
                  <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">{history.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">{t('totalCharacters')}</span>
                  <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">
                    {history.reduce((sum, item) => sum + (item.character_count || 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
