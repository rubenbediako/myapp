import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject, generateText, streamText } from 'ai';
import { z } from 'zod';

// Create a Google provider instance with explicit API key configuration
function createGoogleProvider() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Generative AI API key is missing. Pass it using the \'apiKey\' parameter or the GOOGLE_GENERATIVE_AI_API_KEY environment variable.');
  }
  
  return createGoogleGenerativeAI({
    apiKey,
  });
}

// Create the default model using the configured provider
function getDefaultModel() {
  const googleProvider = createGoogleProvider();
  return googleProvider('gemini-1.5-flash');
}

/**
 * Generate text using Google's Gemini model
 */
export async function generateAIText(prompt: string, options?: {
  temperature?: number;
}) {
  try {
    const defaultModel = getDefaultModel();
    const { text } = await generateText({
      model: defaultModel,
      prompt,
      temperature: options?.temperature ?? 0.7,
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
    temperature?: number;
  }
): Promise<T> {
  try {
    const defaultModel = getDefaultModel();
    const { object } = await generateObject({
      model: defaultModel,
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
  temperature?: number;
}) {
  const defaultModel = getDefaultModel();
  return streamText({
    model: defaultModel,
    prompt,
    temperature: options?.temperature ?? 0.7,
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
