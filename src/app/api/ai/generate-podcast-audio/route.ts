import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateStructuredData } from '@/lib/ai';
import { generatePremiumAudio, getBestTTSProvider, TTS_CONFIG, generateGeminiAudio } from '@/lib/tts-services';

const AudioGenerationRequestSchema = z.object({
  podcastScript: z.array(z.object({
    speaker: z.enum(["Speaker1", "Speaker2"]),
    line: z.string()
  })),
  audioFormat: z.enum(['mp3', 'wav']).optional().default('mp3'),
  query: z.string().optional(),
  generateVisuals: z.boolean().optional().default(true),
  ttsProvider: z.enum(['elevenlabs', 'auto']).optional().default('elevenlabs'),
  generatePremiumAudio: z.boolean().optional().default(false)
});

// Schema for visual content generation with mathematical support
const VisualContentSchema = z.object({
  images: z.array(z.object({
    title: z.string().describe("Title for the image"),
    description: z.string().describe("Description of what the image should show"),
    prompt: z.string().describe("Detailed prompt for image generation"),
    type: z.enum(["chart", "infographic", "illustration", "diagram", "mathematical-graph", "economic-model"]).describe("Type of visual content")
  })),
  statistics: z.array(z.object({
    label: z.string().describe("Label for the statistic"),
    value: z.string().describe("The statistical value with units"),
    context: z.string().describe("Context or explanation of the statistic"),
    source: z.string().describe("Data source or basis for the statistic"),
    formula: z.string().optional().describe("Mathematical formula if applicable (LaTeX format)")
  })),
  charts: z.array(z.object({
    title: z.string().describe("Chart title"),
    type: z.enum(["line", "bar", "pie", "scatter", "area", "function-plot", "regression"]).describe("Chart type"),
    description: z.string().describe("Description of what the chart shows"),
    data: z.object({
      labels: z.array(z.string()).describe("Chart labels"),
      values: z.array(z.number()).describe("Chart values"),
      categories: z.array(z.string()).optional().describe("Data categories"),
      equation: z.string().optional().describe("Mathematical equation for function plots (LaTeX format)")
    }),
    xAxisLabel: z.string().optional().describe("X-axis label"),
    yAxisLabel: z.string().optional().describe("Y-axis label")
  })),
  equations: z.array(z.object({
    title: z.string().describe("Equation title"),
    latex: z.string().describe("LaTeX formatted equation"),
    explanation: z.string().describe("Plain text explanation of the equation"),
    variables: z.array(z.object({
      symbol: z.string().describe("Variable symbol"),
      meaning: z.string().describe("What the variable represents"),
      unit: z.string().optional().describe("Unit of measurement if applicable")
    })),
    category: z.enum(["algebra", "calculus", "statistics", "economics", "finance"]).describe("Mathematical category")
  })),
  keyTerms: z.array(z.object({
    term: z.string().describe("Key term or concept"),
    definition: z.string().describe("Clear definition"),
    symbol: z.string().optional().describe("Mathematical symbol if applicable"),
    formula: z.string().optional().describe("Associated formula (LaTeX format)")
  }))
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { podcastScript, audioFormat, query, generateVisuals, ttsProvider, generatePremiumAudio: enablePremiumAudio } = AudioGenerationRequestSchema.parse(body);

    // Format script for audio generation
    const audioScript = podcastScript.map((line, index) => ({
      id: index,
      speaker: line.speaker,
      speakerName: line.speaker === "Speaker1" ? "Rita" : "Das",
      text: line.line,
      voice: line.speaker === "Speaker1" ? "female" : "male"
    }));

    let visualContent = null;
    let premiumAudioData = null;
    
    // Generate premium audio if requested and API keys are available
    if (enablePremiumAudio) {
      try {
        // Prioritize ElevenLabs for premium audio, Google Gemini for text
        const provider = (ttsProvider === 'auto' || ttsProvider === 'elevenlabs') && process.env.ELEVENLABS_API_KEY 
          ? 'elevenlabs' 
          : ttsProvider === 'auto' ? getBestTTSProvider() : ttsProvider;
        
        if (provider === 'elevenlabs') {
          // Individual segment generation for premium TTS providers
          const audioResults = [];
          
          for (const segment of audioScript) {
            const speaker = segment.speaker === "Speaker1" ? "rita" : "das";
            const result = await generatePremiumAudio(segment.text, speaker, provider);
            
            if (result.success && result.base64Audio) {
              audioResults.push({
                segmentId: segment.id,
                speakerName: segment.speakerName,
                text: segment.text,
                base64Audio: result.base64Audio,
                duration: result.duration
              });
            }
          }
          
          if (audioResults.length > 0) {
            premiumAudioData = {
              provider,
              segments: audioResults,
              totalSegments: audioResults.length,
              format: 'mp3'
            };
          }
        }
      } catch (error) {
        console.error('Premium audio generation failed:', error);
        // Continue with regular processing
      }
    }
    
    // Generate visual content if requested and query is provided
    if (generateVisuals && query) {
      try {
        const visualPrompt = `Based on the topic "${query}" and the following podcast conversation, generate comprehensive educational visual content including:

1. **Images/Illustrations**: Visual concepts, diagrams, economic models, mathematical graphs
2. **Key Statistics**: Important numerical data with proper units and context
3. **Charts/Graphs**: Data visualizations including function plots for mathematical content
4. **Mathematical Equations**: Formulas, functions, and equations in LaTeX format
5. **Key Terms**: Important concepts with definitions and symbols

Focus on educational content that supports learning in:
- Economics (micro/macro concepts, models, curves)
- Mathematics (algebra, calculus, statistics, functions)
- Business and Finance (formulas, ratios, calculations)
- Data Analysis and Visualization

Podcast content summary:
${podcastScript.map(line => `${line.speaker === "Speaker1" ? "Rita" : "Das"}: ${line.line}`).join('\n')}

Generate specific, educational, and mathematically accurate content. Include proper LaTeX formatting for equations and mathematical symbols. Ensure all data is realistic and educational.`;

        visualContent = await generateStructuredData(visualPrompt, VisualContentSchema, {
          temperature: 0.4
        });
      } catch (error) {
        console.error('Error generating visual content:', error);
        // Continue without visual content if generation fails
      }
    }

    // Return the formatted script, visual content, and premium audio
    return NextResponse.json({
      success: true,
      audioScript,
      visualContent,
      premiumAudio: premiumAudioData,
      ttsInfo: {
        availableProviders: {
          elevenlabs: TTS_CONFIG.hasElevenLabs,
          googleGemini: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
        },
        recommendedProvider: 'elevenlabs',
        pureNaturalVoice: !!premiumAudioData
      },
      instructions: premiumAudioData ? 
        "Premium audio generated with ElevenLabs high-quality voices" : 
        "Failed to generate premium audio - please check ElevenLabs API configuration",
      totalSegments: audioScript.length,
      hasVisuals: !!visualContent,
      hasPremiumAudio: !!premiumAudioData
    });
    
  } catch (error) {
    console.error('Error in audio generation:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to prepare audio generation', details: errorMessage },
      { status: 500 }
    );
  }
}
