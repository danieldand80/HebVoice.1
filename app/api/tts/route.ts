import { NextRequest, NextResponse } from 'next/server'
import { generateSpeech } from '@/lib/google-tts'

export async function POST(req: NextRequest) {
  try {
    const { text, voice, speed } = await req.json()

    if (!text || !voice || speed === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: text, voice, speed' },
        { status: 400 }
      )
    }

    // Validate text length (limit to 5000 characters)
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

    return NextResponse.json({
      success: true,
      audioBase64: result.audioBase64,
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
