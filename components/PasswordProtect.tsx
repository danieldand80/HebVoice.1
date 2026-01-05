'use client'

import { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
import Link from 'next/link'

interface PasswordProtectProps {
  children: React.ReactNode
  password: string
}

export default function PasswordProtect({ children, password }: PasswordProtectProps) {
  const [passwordEntered, setPasswordEntered] = useState(false)
  const [inputPassword, setInputPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if password already entered in session
    const savedPassword = sessionStorage.getItem('admin_auth')
    if (savedPassword === password) {
      setPasswordEntered(true)
    }
    setIsLoading(false)
  }, [password])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputPassword === password) {
      setPasswordEntered(true)
      setPasswordError(false)
      sessionStorage.setItem('admin_auth', inputPassword)
    } else {
      setPasswordError(true)
      setInputPassword('')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Checking access...</p>
        </div>
      </div>
    )
  }

  if (!passwordEntered) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <BarChart3 className="text-purple-600 mx-auto mb-4" size={48} />
            <h1 className="text-2xl font-bold dark:text-white mb-2">Admin Access</h1>
            <p className="text-gray-600 dark:text-gray-300">Enter password to view analytics</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:outline-none"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">Incorrect password. Try again.</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition"
            >
              Access Analytics
            </button>
            
            <Link 
              href="/dashboard"
              className="block text-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              ← Back to Dashboard
            </Link>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

