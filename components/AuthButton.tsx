'use client'

import { supabase } from '@/lib/supabase'
import { useTranslation } from '@/hooks/useTranslation'

export default function AuthButton() {
  const { t } = useTranslation()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
    >
      {t('loginButton')}
    </button>
  )
}

