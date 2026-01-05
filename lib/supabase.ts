import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
      }
      tts_requests: {
        Row: {
          id: string
          user_id: string
          text: string
          voice: string
          speed: number
          audio_url: string | null
          created_at: string
        }
      }
    }
  }
}




