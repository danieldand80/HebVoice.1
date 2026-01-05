'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AuthButton from './AuthButton'
import UserProfile from './UserProfile'

export default function AuthSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    )
  }

  return isAuthenticated ? <UserProfile /> : <AuthButton />
}

