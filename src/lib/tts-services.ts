/**
 * Text-to-Speech Services Configuration
 * Supports multiple TTS providers for high-quality audio generation
 */

export interface TTSConfig {
  provider: 'elevenlabs' | 'google-cloud' | 'azure';
  apiKey?: string;
  voice?: string;
  model?: string;
  settings?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    stability?: number;
    clarity?: number;
  };
}

export interface TTSResponse {
  audioUrl?: string;
  audioData?: Blob;
  base64Audio?: string;
  duration?: number;
  success: boolean;
  error?: string;
}

/**
 * ElevenLabs TTS Integration
 * High-quality AI voices for natural-sounding speech
 */
export async function generateElevenLabsAudio(
  text: string, 
  voiceId: string = 'EXAVITQu4vr4xnSDxMaL', // Default female voice
  apiKey?: string
): Promise<TTSResponse> {
  if (!apiKey) {
    return { success: false, error: 'ElevenLabs API key not provided' };
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioData = await response.blob();
    
    // Convert blob to base64 for easier transport
    const arrayBuffer = await audioData.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    
    return {
      success: true,
      audioData: audioData,
      base64Audio: base64Audio,
      duration: 0 // Would need separate API call to get duration
    };
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Google Gemini TTS Integration
 * Native multi-speaker TTS with high quality voices
 */
export async function generateGeminiAudio(
  text: string,
  speaker: 'rita' | 'das',
  apiKey?: string,
  isMultiSpeaker: boolean = false
): Promise<TTSResponse> {
  if (!apiKey) {
    return { success: false, error: 'Google Gemini API key not provided' };
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);

    // Voice mapping for Gemini TTS (enhanced for podcast conversations)
    const voiceMapping = {
      rita: 'Kore', // Firm, clear female voice for educational content
      das: 'Puck'   // Upbeat, knowledgeable male voice for expert explanations
    };

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-preview-tts' 
    });

    let prompt: string;
    let speechConfig: any;

    if (isMultiSpeaker) {
      // Enhanced multi-speaker configuration for podcast conversations
      prompt = `Generate a natural, educational podcast conversation with clear speaker differentiation:

${text}

Instructions:
- Rita should sound professional and engaging, like an educational host
- Das should sound knowledgeable and authoritative, like an expert guest
- Use natural conversation pacing with appropriate pauses
- Emphasize important economic and business terms clearly`;

      speechConfig = {
        response_modalities: ["AUDIO"],
        speech_config: {
          multi_speaker_voice_config: {
            speaker_voice_configs: [
              {
                speaker: 'Rita',
                voice_config: {
                  prebuilt_voice_config: {
                    voice_name: voiceMapping.rita
                  }
                }
              },
              {
                speaker: 'Das',
                voice_config: {
                  prebuilt_voice_config: {
                    voice_name: voiceMapping.das
                  }
                }
              }
            ]
          }
        }
      };
    } else {
      // Single-speaker configuration with enhanced prompting
      prompt = `Generate clear, professional educational content: ${text}`;
      
      speechConfig = {
        response_modalities: ["AUDIO"],
        speech_config: {
          voice_config: {
            prebuilt_voice_config: {
              voice_name: voiceMapping[speaker]
            }
          }
        }
      };
    }

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: speechConfig
    });

    // Extract audio data from response
    const audioData = response.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioData) {
      throw new Error('No audio data in response');
    }

    // Convert to blob and base64
    const audioBuffer = Buffer.from(audioData, 'base64');
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
    const base64Audio = audioData; // Already base64

    return {
      success: true,
      audioData: audioBlob,
      base64Audio: base64Audio,
      duration: 0 // Duration would need to be calculated
    };
  } catch (error) {
    console.error('Google Gemini TTS error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Voice mapping for different speakers
 */
export const VOICE_MAPPING = {
  elevenlabs: {
    rita: 'EXAVITQu4vr4xnSDxMaL', // Bella - Natural female voice
    das: 'VR6AewLTigWG4xSOukaG'   // Arnold - Professional male voice
  },
  gemini: {
    rita: 'Kore' as const,    // Firm female voice
    das: 'Puck' as const      // Upbeat male voice
  }
};

/**
 * TTS Service Configuration
 */
export const TTS_CONFIG = {
  // Check for API keys in environment
  hasElevenLabs: !!process.env.ELEVENLABS_API_KEY,
  hasGemini: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  
  // Prioritize ElevenLabs for premium audio quality
  defaultProvider: process.env.ELEVENLABS_API_KEY ? 'elevenlabs' as const :
                   process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'google-gemini' as const :
                   'elevenlabs' as const, // Always default to ElevenLabs
  
  // Quality ranking (ElevenLabs prioritized for premium audio)
  qualityRanking: {
    'elevenlabs': 6, // Highest priority for premium audio quality
    'google-gemini': 4, // Still good for unified experience
    'google-cloud': 3,
    'azure': 3
  }
};

/**
 * Get the best available TTS provider
 */
export function getBestTTSProvider(): keyof typeof TTS_CONFIG.qualityRanking {
  if (process.env.ELEVENLABS_API_KEY) return 'elevenlabs';
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return 'google-gemini';
  return 'elevenlabs'; // Always default to ElevenLabs
}

/**
 * Generate audio using the best available provider
 */
export async function generatePremiumAudio(
  text: string,
  speaker: 'rita' | 'das',
  provider?: string
): Promise<TTSResponse> {
  const selectedProvider = provider || getBestTTSProvider();
  
  switch (selectedProvider) {
    case 'elevenlabs':
      const elevenlabsVoice = VOICE_MAPPING.elevenlabs[speaker];
      return generateElevenLabsAudio(text, elevenlabsVoice, process.env.ELEVENLABS_API_KEY);
      
    case 'google-gemini':
      return generateGeminiAudio(text, speaker, process.env.GOOGLE_GENERATIVE_AI_API_KEY);
      
    default:
      // No fallback - only premium TTS supported
      return {
        success: false,
        error: 'Premium audio TTS not available - ElevenLabs API recommended'
      };
  }
}
