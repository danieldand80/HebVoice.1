'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { BarChart3, Users, MessageSquare, TrendingUp, Calendar, Volume2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AnalyticsData {
  date: string
  total_requests: number
  total_characters: number
  unique_users: number
  popular_voice: string
  avg_text_length: number
}

export default function AdminPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [totalStats, setTotalStats] = useState({
    totalRequests: 0,
    totalCharacters: 0,
    totalUsers: 0,
    avgRequestsPerDay: 0,
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // For now, allow any authenticated user to view analytics
      // You can add specific admin email checks here later
      if (user) {
        setAuthorized(true)
        loadAnalytics()
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/')
    }
  }

  const loadAnalytics = async () => {
    try {
      // Load analytics from view
      const { data, error } = await supabase
        .from('analytics_dashboard')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error

      if (data) {
        setAnalytics(data)
        calculateTotalStats(data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalStats = (data: AnalyticsData[]) => {
    const total = data.reduce(
      (acc, day) => ({
        totalRequests: acc.totalRequests + day.total_requests,
        totalCharacters: acc.totalCharacters + day.total_characters,
        totalUsers: Math.max(acc.totalUsers, day.unique_users),
      }),
      { totalRequests: 0, totalCharacters: 0, totalUsers: 0 }
    )

    setTotalStats({
      ...total,
      avgRequestsPerDay: data.length > 0 ? Math.round(total.totalRequests / data.length) : 0,
    })
  }

  if (!authorized || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
                <ArrowLeft size={24} />
              </Link>
              <div className="flex items-center gap-2 text-xl font-bold dark:text-white">
                <BarChart3 className="text-purple-600" />
                <span>HebVoice Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Requests</h3>
              <Volume2 className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {totalStats.totalRequests.toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Characters</h3>
              <MessageSquare className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalStats.totalCharacters.toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Unique Users</h3>
              <Users className="text-green-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {totalStats.totalUsers}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Requests/Day</h3>
              <TrendingUp className="text-orange-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {totalStats.avgRequestsPerDay}
            </p>
          </div>
        </div>

        {/* Daily Analytics Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
              <Calendar size={24} className="text-purple-600" />
              Daily Analytics (Last 30 Days)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Requests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Characters
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Unique Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Popular Voice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Avg Length
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {analytics.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No analytics data yet
                    </td>
                  </tr>
                ) : (
                  analytics.map((day, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {new Date(day.date).toLocaleDateString('he-IL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {day.total_requests}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {day.total_characters.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {day.unique_users}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {day.popular_voice || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {Math.round(day.avg_text_length)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

