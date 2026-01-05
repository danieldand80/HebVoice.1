// Gemini TTS API integration
// Docs: https://ai.google.dev/gemini-api/docs/text-to-speech

export async function generateSpeechGemini(
  text: string,
  voice: string = 'Puck',
  speed: number = 1.0
): Promise<{ success: boolean; audioBase64?: string; error?: string }> {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    
    if (!apiKey) {
      throw new Error('Google AI API key not configured')
    }

    // Gemini TTS API endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Convert this text to speech in Hebrew: ${text}`
            }]
          }],
          generationConfig: {
            responseMimeType: 'audio/wav',
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voice,
                }
              },
              speakingRate: speed,
            }
          }
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Gemini TTS Error:', error)
      throw new Error(error.error?.message || 'Gemini TTS generation failed')
    }

    const data = await response.json()
    
    // Extract audio from response
    const audioContent = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
    
    if (!audioContent) {
      throw new Error('No audio content in response')
    }
    
    return {
      success: true,
      audioBase64: audioContent, // Base64 encoded audio
    }
  } catch (error: any) {
    console.error('Gemini TTS Error:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate speech with Gemini',
    }
  }
}

// Available Gemini voices
// Note: These are English voices, Hebrew support needs to be verified
export const GEMINI_VOICES = [
  { id: 'Puck', name: 'Puck (Default)' },
  { id: 'Charon', name: 'Charon' },
  { id: 'Kore', name: 'Kore' },
  { id: 'Fenrir', name: 'Fenrir' },
  { id: 'Aoede', name: 'Aoede' },
]

