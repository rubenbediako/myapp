# Premium Text-to-Speech Setup Guide

To enable premium, natural-sounding voices for your podcast generation, you can integrate with professional TTS services.

## Supported Premium TTS Services

### 1. ElevenLabs (Recommended)
- **Quality**: Highest quality, most natural-sounding voices
- **Setup**: Add `ELEVENLABS_API_KEY` to your `.env.local` file
- **Cost**: Pay-per-character usage
- **Voices**: Professional AI voices with emotional expression

**Setup Steps:**
1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Get your API key from the dashboard
3. Add to `.env.local`: `ELEVENLABS_API_KEY=your_api_key_here`

### 2. Google Gemini TTS (New!)
- **Quality**: High quality with native multi-speaker support
- **Setup**: Uses your existing `GOOGLE_GENERATIVE_AI_API_KEY`
- **Cost**: Part of Google AI API usage
- **Voices**: 30+ voice options with natural conversation flow
- **Special Feature**: Can generate entire conversations in one go

**Setup Steps:**
1. Get Google AI API access at [Google AI Studio](https://aistudio.google.com)
2. Your existing Gemini API key automatically enables TTS
3. No additional setup required if you already have `GOOGLE_GENERATIVE_AI_API_KEY`

### 3. OpenAI TTS
- **Quality**: High quality, natural voices
- **Setup**: Add `OPENAI_API_KEY` to your `.env.local` file
- **Cost**: Pay-per-character usage
- **Voices**: 6 different voice options (alloy, echo, fable, onyx, nova, shimmer)

**Setup Steps:**
1. Get OpenAI API access at [OpenAI](https://platform.openai.com)
2. Generate an API key
3. Add to `.env.local`: `OPENAI_API_KEY=your_api_key_here`

### 4. Web Speech API (Default)
- **Quality**: Basic quality, robotic voices
- **Setup**: No setup required, works in browser
- **Cost**: Free
- **Voices**: Browser-provided voices

## Voice Mapping

The system automatically assigns appropriate voices to each speaker:

- **Rita (Speaker1)**: Female voice for educational discussions
- **Das (Speaker2)**: Male voice for expert explanations

## Environment Setup

Add these to your `.env.local` file:

```env
# Premium TTS Services (Optional)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini API (enables both AI text generation AND TTS)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
```

## Provider Priority

The system automatically selects the best available TTS provider:

1. **ElevenLabs** (highest quality individual voices)
2. **Google Gemini** (best for multi-speaker conversations)
3. **OpenAI** (reliable, good quality)
4. **Web Speech API** (fallback, browser-based)

## Usage

1. Enable "Use Premium AI Voices" toggle in the UI
2. Generate your podcast
3. The system will automatically use the best available TTS service
4. Fallback to Web Speech API if no premium services are configured

## Quality Comparison

| Service | Quality | Naturalness | Multi-Speaker | Cost | Setup |
|---------|---------|-------------|---------------|------|-------|
| ElevenLabs | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | $$ | Easy |
| Google Gemini | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $ | Auto |
| OpenAI TTS | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | $ | Easy |
| Web Speech | ⭐⭐ | ⭐⭐ | ⭐ | Free | None |

## Cost Estimates

- **ElevenLabs**: ~$0.30 per 1000 characters
- **Google Gemini**: ~$0.002 per 1000 characters (part of AI API)
- **OpenAI TTS**: ~$0.015 per 1000 characters  
- **Web Speech**: Free

A typical 5-minute podcast (~750 words) costs:
- ElevenLabs: ~$1.50
- OpenAI: ~$0.08
- Web Speech: Free
