'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, Download, History, Settings, LogOut, Play, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { VOICES, SPEEDS } from '@/lib/google-tts'

export default function DashboardPage() {
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

  const loadHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('tts_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) setHistory(data)
  }

  const handleGenerate = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setAudioBase64(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice,
          speed,
          userId: user?.id
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate speech')
      }

      if (result.success && result.audioBase64) {
        setAudioBase64(result.audioBase64)
        loadHistory()
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
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <LogOut size={20} />
              התנתק
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">צור קול חדש</h2>
              
              <textarea
                className="w-full h-48 p-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-purple-500 focus:outline-none mb-2 resize-none"
                placeholder="הדבק את הטקסט שלך כאן..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={5000}
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-left">
                {text.length} / 5000 תווים
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">בחר קול</label>
                  <select
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-purple-500 focus:outline-none"
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                  >
                    {VOICES.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">מהירות דיבור</label>
                  <select
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-purple-500 focus:outline-none"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                  >
                    {SPEEDS.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
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
                    מייצר קול...
                  </>
                ) : (
                  'צור קול'
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {error}
                </div>
              )}

              {audioBase64 && !error && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-800 font-medium">הקול נוצר בהצלחה! 🎉</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handlePlayAudio}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Play size={20} />
                      השמע
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Download size={20} />
                      הורד MP3
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                <History size={24} />
                היסטוריה
              </h3>

              <div className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    עדיין לא יצרת קולות
                  </p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-500 cursor-pointer transition"
                    >
                      <p className="text-sm font-medium truncate mb-1 dark:text-gray-200">
                        {item.text || 'קול ללא טקסט'}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.created_at).toLocaleDateString('he-IL')}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          {item.character_count} תווים
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                <Settings size={24} />
                סטטיסטיקה
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">קולות שנוצרו</span>
                  <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">{history.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">סה"כ תווים</span>
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
