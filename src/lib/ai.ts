import { google } from '@ai-sdk/google';
import { generateObject, generateText, streamText } from 'ai';
import { z } from 'zod';

// Initialize the Google AI provider
const googleAI = google({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Default model configuration
const defaultModel = googleAI('gemini-1.5-flash');

/**
 * Generate text using Google's Gemini model
 */
export async function generateAIText(prompt: string, options?: {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}) {
  try {
    const { text } = await generateText({
      model: options?.model ? googleAI(options.model) : defaultModel,
      prompt,
      temperature: options?.temperature ?? 0.7,
      maxTokens: options?.maxTokens ?? 1000,
    });
    
    return text;
  } catch (error) {
    console.error('Error generating AI text:', error);
    throw new Error('Failed to generate AI text');
  }
}

/**
 * Generate structured data using AI with Zod schema validation
 */
export async function generateStructuredData<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  options?: {
    model?: string;
    temperature?: number;
  }
): Promise<T> {
  try {
    const { object } = await generateObject({
      model: options?.model ? googleAI(options.model) : defaultModel,
      prompt,
      schema,
      temperature: options?.temperature ?? 0.7,
    });
    
    return object;
  } catch (error) {
    console.error('Error generating structured data:', error);
    throw new Error('Failed to generate structured data');
  }
}

/**
 * Create a streaming text response for real-time AI interactions
 */
export function createStreamingResponse(prompt: string, options?: {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}) {
  return streamText({
    model: options?.model ? googleAI(options.model) : defaultModel,
    prompt,
    temperature: options?.temperature ?? 0.7,
    maxTokens: options?.maxTokens ?? 1000,
  });
}

// Export commonly used schemas
export const PodcastLineSchema = z.object({
  speaker: z.enum(["Speaker1", "Speaker2"]).describe("The speaker, either the Interviewer (Speaker1/Rita) or the Economist (Speaker2/Das)."),
  line: z.string().describe("The line of dialogue for the speaker."),
});

export const PodcastScriptSchema = z.object({
  podcastScript: z.array(PodcastLineSchema).describe("The full podcast script as an array of speaker lines."),
});

export const BusinessPlanSchema = z.object({
  title: z.string().describe("The business plan title"),
  executiveSummary: z.string().describe("Executive summary of the business plan"),
  marketAnalysis: z.string().describe("Market analysis section"),
  businessModel: z.string().describe("Business model description"),
  financialProjections: z.string().describe("Financial projections"),
  riskAnalysis: z.string().describe("Risk analysis"),
});

export const EconomicAnalysisSchema = z.object({
  summary: z.string().describe("Brief summary of the analysis"),
  keyFindings: z.array(z.string()).describe("Key findings from the analysis"),
  implications: z.string().describe("Economic implications"),
  recommendations: z.array(z.string()).describe("Recommendations based on the analysis"),
});
