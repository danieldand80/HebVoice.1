// Google Cloud Text-to-Speech integration with Chirp 3 HD
// Docs: https://cloud.google.com/text-to-speech/docs

export async function generateSpeech(
  text: string,
  voice: string,
  speed: number
): Promise<{ success: boolean; audioBase64?: string; error?: string }> {
  try {
    // Use Google Cloud TTS REST API with Chirp 3 HD
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

// Available Hebrew Chirp 3 HD voices - Premium quality
export const VOICES = [
  // Male voices (גברים)
  { id: 'he-IL-Chirp3-HD-Enceladus', name: 'Enceladus - גבר (איכות גבוהה)' },
  { id: 'he-IL-Chirp3-HD-Fenrir', name: 'Fenrir - גבר (איכות גבוהה)' },
  { id: 'he-IL-Chirp3-HD-Iapetus', name: 'Iapetus - גבר (איכות גבוהה)' },
  { id: 'he-IL-Chirp3-HD-Orus', name: 'Orus - גבר (איכות גבוהה)' },
  { id: 'he-IL-Chirp3-HD-Puck', name: 'Puck - גבר (איכות גבוהה)' },
  
  // Female voices (נשים)
  { id: 'he-IL-Chirp3-HD-Erinome', name: 'Erinome - אישה (איכות גבוהה)' },
  { id: 'he-IL-Chirp3-HD-Gacrux', name: 'Gacrux - אישה (איכות גבוהה)' },
  { id: 'he-IL-Chirp3-HD-Kore', name: 'Kore - אישה (איכות גבוהה)' },
  { id: 'he-IL-Chirp3-HD-Laomedeia', name: 'Laomedeia - אישה (איכות גבוהה)' },
  { id: 'he-IL-Chirp3-HD-Leda', name: 'Leda - אישה (איכות גבוהה)' },
  { id: 'he-IL-Chirp3-HD-Pulcherrima', name: 'Pulcherrima - אישה (איכות גבוהה)' },
]

export const SPEEDS = [
  { id: 0.75, name: 'איטי (0.75x)' },
  { id: 1.0, name: 'רגיל (1.0x)' },
  { id: 1.25, name: 'מהיר (1.25x)' },
  { id: 1.5, name: 'מהיר מאוד (1.5x)' },
]
