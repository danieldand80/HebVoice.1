import { NextRequest, NextResponse } from 'next/server'
import { generateSpeech } from '@/lib/google-tts'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { text, voice, speed, userId } = await req.json()

    if (!text || !voice || speed === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: text, voice, speed' },
        { status: 400 }
      )
    }

    // Validate text length (limit to 5000 characters for now)
    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 5000 characters.' },
        { status: 400 }
      )
    }

    // Generate speech using Google Cloud TTS
    const result = await generateSpeech(text, voice, speed)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate speech' },
        { status: 500 }
      )
    }

    // Save to Supabase Storage if user is authenticated
    let audioUrl = null
    if (userId && result.audioBase64) {
      try {
        const supabase = createRouteHandlerClient({ cookies })
        
        // Convert base64 to buffer
        const audioBuffer = Buffer.from(result.audioBase64, 'base64')
        
        // Generate unique filename
        const fileName = `${userId}/${Date.now()}.mp3`
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('audio-files')
          .upload(fileName, audioBuffer, {
            contentType: 'audio/mp3',
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Storage upload error:', uploadError)
        } else {
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('audio-files')
            .getPublicUrl(fileName)
          
          audioUrl = publicUrl
          
          // Save metadata to database
          await supabase.from('tts_requests').insert({
            user_id: userId,
            text: text.substring(0, 200),
            voice,
            speed,
            character_count: text.length,
            audio_url: publicUrl,
          })
        }
      } catch (dbError) {
        console.error('Database/Storage save error:', dbError)
        // Don't fail the request if save fails
      }
    }

    return NextResponse.json({
      success: true,
      audioBase64: result.audioBase64, // Still return for immediate playback
      audioUrl, // Public URL for future access
      characterCount: text.length,
    })
  } catch (error: any) {
    console.error('TTS API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check API status
export async function GET() {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_CLOUD_API_KEY
  
  return NextResponse.json({
    status: 'ok',
    apiConfigured: !!apiKey,
    timestamp: new Date().toISOString(),
  })
}
