// Google Cloud Text-to-Speech integration
// Docs: https://cloud.google.com/text-to-speech/docs

export async function generateSpeech(
  text: string,
  voice: string,
  speed: number
): Promise<{ success: boolean; audioBase64?: string; error?: string }> {
  try {
    // Use Google Cloud TTS REST API
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_CLOUD_API_KEY
    
    if (!apiKey) {
      throw new Error('Google Cloud API key not configured')
    }

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'he-IL',
            name: voice,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: speed,
            pitch: 0,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Google TTS Error:', error)
      throw new Error(error.error?.message || 'TTS generation failed')
    }

    const data = await response.json()
    
    return {
      success: true,
      audioBase64: data.audioContent, // Base64 encoded MP3
    }
  } catch (error: any) {
    console.error('TTS Error:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate speech',
    }
  }
}

// Available Hebrew voices in Google Cloud TTS
export const VOICES = [
  { id: 'he-IL-Wavenet-A', name: 'דוד - גבר (Wavenet)' },
  { id: 'he-IL-Wavenet-B', name: 'שרה - אישה (Wavenet)' },
  { id: 'he-IL-Wavenet-C', name: 'רות - אישה (Wavenet)' },
  { id: 'he-IL-Wavenet-D', name: 'יוסי - גבר (Wavenet)' },
  { id: 'he-IL-Standard-A', name: 'דוד - גבר (Standard)' },
  { id: 'he-IL-Standard-B', name: 'שרה - אישה (Standard)' },
  { id: 'he-IL-Standard-C', name: 'רות - אישה (Standard)' },
  { id: 'he-IL-Standard-D', name: 'יוסי - גבר (Standard)' },
]

export const SPEEDS = [
  { id: 0.75, name: 'איטי (0.75x)' },
  { id: 1.0, name: 'רגיל (1.0x)' },
  { id: 1.25, name: 'מהיר (1.25x)' },
  { id: 1.5, name: 'מהיר מאוד (1.5x)' },
]
