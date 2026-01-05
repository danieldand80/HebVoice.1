import { createClient } from '@supabase/supabase-js'
import { BarChart3, Users, MessageSquare, TrendingUp, Calendar, Volume2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import PasswordProtect from '@/components/PasswordProtect'

interface AnalyticsData {
  date: string
  total_requests: number
  total_characters: number
  unique_users: number
  popular_voice: string
  avg_text_length: number
}

// Server-side data fetching
async function getAnalytics(): Promise<AnalyticsData[]> {
  try {
    // Create Supabase client with service role for server-side
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30)

    if (error) {
      console.error('Error fetching analytics:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getAnalytics:', error)
    return []
  }
}

export default async function AdminPage() {
  // Fetch data on server
  const analytics = await getAnalytics()

  // Calculate total stats
  const totalStats = analytics.reduce(
    (acc, day) => ({
      totalRequests: acc.totalRequests + day.total_requests,
      totalCharacters: acc.totalCharacters + day.total_characters,
      totalUsers: Math.max(acc.totalUsers, day.unique_users),
    }),
    { totalRequests: 0, totalCharacters: 0, totalUsers: 0 }
  )

  const avgRequestsPerDay = analytics.length > 0 
    ? Math.round(totalStats.totalRequests / analytics.length) 
    : 0

  return (
    <PasswordProtect password="Liron1234">
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
                {avgRequestsPerDay}
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
                        No analytics data yet. Create some voice generations to see stats!
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
    </PasswordProtect>
  )
}
