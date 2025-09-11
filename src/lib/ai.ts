import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

// Initialize Google Gemini (Primary) - only on server side
const genAI = typeof window === 'undefined' ? new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '') : null;

// Initialize Anthropic Claude (Alternative) - only on server side
const anthropic = typeof window === 'undefined' ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
}) : null;

// Available models - now supports Google Gemini and Anthropic Claude
export const AI_MODELS = {
  // Google Gemini models
  gemini_fast: 'gemini-1.5-flash',
  gemini_pro: 'gemini-1.5-pro',
  // Anthropic Claude models
  claude_fast: 'claude-3-haiku-20240307',
  claude_pro: 'claude-3-5-sonnet-20241022',
  claude_opus: 'claude-3-opus-20240229'
} as const;

// Configuration for different AI tasks
export const AI_CONFIG = {
  economicAnalysis: {
    model: AI_MODELS.claude_fast, // Use Claude for analytical content
    temperature: 0.3,
    maxOutputTokens: 2000
  },
  podcastGeneration: {
    model: AI_MODELS.claude_fast, // Use Claude Haiku (working model)
    temperature: 0.7,
    maxOutputTokens: 4000
  },
  dataProcessing: {
    model: AI_MODELS.gemini_fast, // Use Gemini for quick processing
    temperature: 0.1,
    maxOutputTokens: 1000
  },
  multilingualAnalysis: {
    model: AI_MODELS.gemini_pro, // Use Gemini Pro for multilingual tasks
    temperature: 0.4,
    maxOutputTokens: 3000
  }
} as const;

/**
 * Determine which AI provider to use based on the model
 */
function getProviderForModel(model: string): 'gemini' | 'claude' {
  if (model.startsWith('gemini')) return 'gemini';
  if (model.startsWith('claude')) return 'claude';
  return 'claude'; // Default to Claude
}

/**
 * AI text generation supporting multiple providers with automatic fallback
 */
export async function generateAIText(
  prompt: string, 
  task: keyof typeof AI_CONFIG = 'economicAnalysis',
  options?: { temperature?: number; maxTokens?: number }
) {
  const config = AI_CONFIG[task];
  const provider = getProviderForModel(config.model);
  
  try {
    return await attemptGeneration(provider, config, prompt, options);
  } catch (error) {
    console.warn(`Primary provider ${provider} failed, attempting fallback to Claude...`);
    
    // Fallback to Claude if primary provider fails
    if (provider !== 'claude') {
      try {
        const fallbackConfig = {
          model: AI_MODELS.claude_fast,
          temperature: config.temperature,
          maxOutputTokens: config.maxOutputTokens
        };
        return await attemptGeneration('claude', fallbackConfig, prompt, options);
      } catch (fallbackError) {
        console.error('Fallback to Claude also failed:', fallbackError);
        throw error; // Throw the original error
      }
    }
    
    throw error; // Re-throw if Claude was the primary provider
  }
}

/**
 * Attempt text generation with a specific provider
 */
async function attemptGeneration(
  provider: 'gemini' | 'claude',
  config: { model: string; temperature: number; maxOutputTokens: number },
  prompt: string,
  options?: { temperature?: number; maxTokens?: number }
) {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('AI functions can only be called on the server side');
    }

    if (provider === 'claude') {
      if (!anthropic) {
        throw new Error('Anthropic client not available');
      }
      // Use Anthropic Claude
      const response = await anthropic.messages.create({
        model: config.model,
        max_tokens: options?.maxTokens ?? config.maxOutputTokens,
        temperature: options?.temperature ?? config.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });
      
      return response.content[0].type === 'text' ? response.content[0].text : '';
    } else {
      if (!genAI) {
        throw new Error('Google AI client not available');
      }
      // Use Google Gemini
      const model = genAI.getGenerativeModel({ 
        model: config.model,
        generationConfig: {
          temperature: options?.temperature ?? config.temperature,
          maxOutputTokens: options?.maxTokens ?? config.maxOutputTokens,
        }
      });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${provider} failed:`, errorMessage);
    
    // Provide more helpful error messages for common issues
    const providerName = provider === 'claude' ? 'Anthropic Claude' : 'Google Gemini';
    
    if (errorMessage.includes('quota') || errorMessage.includes('429')) {
      throw new Error(`${providerName} API quota exceeded. Please try again later or check your billing plan.`);
    } else if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
      throw new Error(`${providerName} service is temporarily overloaded. Please try again in a few minutes.`);
    } else if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      throw new Error(`${providerName} API key is invalid or unauthorized.`);
    } else {
      throw new Error(`Failed to generate AI text with ${providerName}: ${errorMessage}`);
    }
  }
}

/**
 * Generate structured data using AI with JSON schema
 */
export async function generateStructuredData<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  options?: {
    temperature?: number;
    task?: keyof typeof AI_CONFIG;
  }
): Promise<T> {
  try {
    const schemaDescription = generateSchemaDescription(schema);
    const enhancedPrompt = `${prompt}

IMPORTANT: Respond with ONLY valid JSON matching this exact structure:
${schemaDescription}

Requirements:
- Return ONLY the JSON object, no additional text, explanations, or markdown
- Ensure all strings are properly escaped
- Do not include any text before or after the JSON`;

    // Use configuration based on task type
    const task = options?.task ?? 'podcastGeneration';
    const config = AI_CONFIG[task];

    // Use Claude for structured data generation
    const response = await anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxOutputTokens,
      temperature: options?.temperature ?? config.temperature,
      messages: [
        {
          role: 'user',
          content: enhancedPrompt
        }
      ]
    });
    
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Clean the response to extract JSON
    const jsonText = extractJSON(text);
    const parsedData = JSON.parse(jsonText);
    
    // Validate with Zod schema
    return schema.parse(parsedData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to generate structured data with Claude:', errorMessage);
    
    // Provide more helpful error messages for common issues
    if (errorMessage.includes('quota') || errorMessage.includes('429')) {
      throw new Error('Anthropic Claude API quota exceeded. Please try again later or check your billing plan.');
    } else if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
      throw new Error('Anthropic Claude service is temporarily overloaded. Please try again in a few minutes.');
    } else if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      throw new Error('Anthropic Claude API key is invalid or unauthorized.');
    } else {
      throw new Error(`Failed to generate structured data: ${errorMessage}`);
    }
  }
}

/**
 * Helper function to generate schema descriptions
 */
function generateSchemaDescription(schema: z.ZodSchema): string {
  try {
    if (schema instanceof z.ZodObject) {
      const shape = schema.shape;
      const properties: string[] = [];
      
      Object.entries(shape).forEach(([key, value]) => {
        if (value instanceof z.ZodString) {
          properties.push(`"${key}": "string value"`);
        } else if (value instanceof z.ZodArray) {
          properties.push(`"${key}": ["array", "of", "items"]`);
        } else if (value instanceof z.ZodObject) {
          properties.push(`"${key}": {"nested": "object"}`);
        } else if (value instanceof z.ZodEnum) {
          properties.push(`"${key}": "enum_value"`);
        } else {
          properties.push(`"${key}": "value"`);
        }
      });
      
      return `{\n  ${properties.join(',\n  ')}\n}`;
    }
    
    return '{"result": "object"}';
  } catch (error) {
    console.error('Error generating schema description:', error);
    return '{"result": "object"}';
  }
}

/**
 * Extract JSON from AI response with better error handling
 */
function extractJSON(text: string): string {
  try {
    // Remove any markdown code blocks
    let cleanText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Remove any leading/trailing whitespace and text
    cleanText = cleanText.trim();
    
    // Find the first { and last } to extract the main JSON object
    const startIndex = cleanText.indexOf('{');
    const lastIndex = cleanText.lastIndexOf('}');
    
    if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
      let jsonStr = cleanText.substring(startIndex, lastIndex + 1);
      
      // Try to fix common JSON issues
      try {
        JSON.parse(jsonStr);
        return jsonStr;
      } catch (firstError) {
        // Try to fix escaped characters
        jsonStr = jsonStr
          .replace(/\\(?!["\\/bfnrt])/g, '\\\\')     // Fix unescaped backslashes
          .replace(/\n/g, '\\n')                      // Escape newlines
          .replace(/\r/g, '\\r')                      // Escape carriage returns
          .replace(/\t/g, '\\t');                     // Escape tabs
        
        JSON.parse(jsonStr);
        return jsonStr;
      }
    }
    
    // Fallback: try to find JSON object or array in the response
    const jsonMatch = cleanText.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      let matchStr = jsonMatch[0];
      
      try {
        JSON.parse(matchStr);
        return matchStr;
      } catch (matchError) {
        // Try to fix escaped characters in the match
        matchStr = matchStr
          .replace(/\\(?!["\\/bfnrt])/g, '\\\\')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        
        JSON.parse(matchStr);
        return matchStr;
      }
    }
    
    // If no JSON found but starts with {, try parsing as-is
    if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
      JSON.parse(cleanText);
      return cleanText;
    }
    
    // Last resort: return error object
    throw new Error('No valid JSON found in response');
  } catch (parseError) {
    console.error('Error extracting JSON:', parseError);
    console.error('Original text:', text.substring(0, 500));
    throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
  }
}

/**
 * Create a streaming text response for real-time AI interactions using Google Gemini
 */
export async function createStreamingResponse(prompt: string, options?: {
  temperature?: number;
}) {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('AI functions can only be called on the server side');
    }
    
    if (!genAI) {
      throw new Error('Google AI client not available');
    }
    
    const model = genAI.getGenerativeModel({ 
      model: AI_MODELS.gemini_fast,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
      }
    });
    
    // For Google Gemini, we'll simulate streaming by generating the full response
    // and then streaming it chunk by chunk
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Create a ReadableStream that yields the content in chunks
    const readableStream = new ReadableStream({
      start(controller) {
        try {
          const chunks = text.match(/.{1,50}/g) || [text]; // Split into ~50 char chunks
          let index = 0;
          
          const sendNextChunk = () => {
            if (index < chunks.length) {
              controller.enqueue(new TextEncoder().encode(chunks[index]));
              index++;
              setTimeout(sendNextChunk, 50); // Small delay between chunks
            } else {
              controller.close();
            }
          };
          
          sendNextChunk();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Error creating streaming response:', error);
    return new Response('Error generating response', { status: 500 });
  }
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

// Enhanced schemas for economic analysis
export const MacroeconomicAnalysisSchema = z.object({
  gdpAnalysis: z.string().describe("GDP growth analysis"),
  inflationTrends: z.string().describe("Inflation trends and predictions"),
  unemploymentInsights: z.string().describe("Unemployment rate analysis"),
  fiscalPolicy: z.string().describe("Fiscal policy recommendations"),
  monetaryPolicy: z.string().describe("Monetary policy analysis"),
  keyIndicators: z.array(z.object({
    indicator: z.string(),
    value: z.string(),
    trend: z.enum(["increasing", "decreasing", "stable"]),
    significance: z.string()
  })),
  recommendations: z.array(z.string()),
  riskFactors: z.array(z.string())
});

export const MicroeconomicAnalysisSchema = z.object({
  marketStructure: z.string().describe("Market structure analysis"),
  supplyDemand: z.string().describe("Supply and demand dynamics"),
  priceElasticity: z.string().describe("Price elasticity analysis"),
  consumerBehavior: z.string().describe("Consumer behavior insights"),
  competitionAnalysis: z.string().describe("Competition and market dynamics"),
  businessStrategies: z.array(z.string()),
  marketOpportunities: z.array(z.string()),
  challenges: z.array(z.string())
});

export const ComparativeAnalysisSchema = z.object({
  country1Analysis: z.string().describe("Analysis of first country"),
  country2Analysis: z.string().describe("Analysis of second country"),
  keyDifferences: z.array(z.string()),
  similarities: z.array(z.string()),
  competitiveAdvantages: z.object({
    country1: z.array(z.string()),
    country2: z.array(z.string())
  }),
  recommendations: z.object({
    country1: z.array(z.string()),
    country2: z.array(z.string())
  }),
  overallInsights: z.string()
});

export const ForecastAnalysisSchema = z.object({
  summary: z.string().describe("Executive summary of forecast predictions"),
  shortTermForecast: z.string().describe("1-2 year forecast"),
  mediumTermForecast: z.string().describe("3-5 year forecast"),
  longTermForecast: z.string().describe("5+ year forecast"),
  keyDrivers: z.array(z.string()),
  riskFactors: z.array(z.string()),
  scenarios: z.array(z.object({
    name: z.string(),
    probability: z.string(),
    description: z.string(),
    impact: z.string()
  })),
  recommendations: z.array(z.string())
});

export const InvestmentAnalysisSchema = z.object({
  marketOverview: z.string().describe("Investment market overview"),
  opportunities: z.array(z.object({
    sector: z.string(),
    description: z.string(),
    riskLevel: z.enum(["low", "medium", "high"]),
    expectedReturn: z.string()
  })),
  risks: z.array(z.string()),
  recommendations: z.array(z.string()),
  timeline: z.string(),
  diversificationStrategy: z.string()
});

export const PersonalFinanceSchema = z.object({
  overview: z.string().describe("Financial overview and current situation"),
  budgetingAdvice: z.string().describe("Budgeting strategies"),
  savingsRecommendations: z.string().describe("Savings recommendations"),
  investmentGuidance: z.string().describe("Investment guidance"),
  debtManagement: z.string().describe("Debt management strategies"),
  retirementPlanning: z.string().describe("Retirement planning advice"),
  emergencyFund: z.string().describe("Emergency fund recommendations"),
  actionItems: z.array(z.string()),
  timeline: z.string()
});

// Economic analysis functions
export async function analyzeMacroeconomics(country: string, indicators: string[]) {
  const prompt = `Provide a comprehensive macroeconomic analysis for ${country} focusing on ${indicators.join(', ')}. 
  Include GDP trends, inflation analysis, unemployment insights, and policy recommendations.
  Base your analysis on current economic data and trends.`;
  
  return generateStructuredData(prompt, MacroeconomicAnalysisSchema, {
    temperature: 0.3
  });
}

export async function analyzeMicroeconomics(country: string, sector: string) {
  const prompt = `Analyze the microeconomic environment in ${country} for the ${sector} sector.
  Focus on market structure, supply and demand dynamics, competition, and business opportunities.`;
  
  return generateStructuredData(prompt, MicroeconomicAnalysisSchema, {
    temperature: 0.3
  });
}

export async function compareCountries(country1: string, country2: string, indicator: string) {
  const prompt = `Compare ${country1} and ${country2} based on ${indicator}.
  Provide detailed analysis of differences, similarities, competitive advantages, and recommendations for each country.`;
  
  return generateStructuredData(prompt, ComparativeAnalysisSchema, {
    temperature: 0.3
  });
}

export async function generateForecast(country: string, timeframe: string, factors: string[]) {
  const prompt = `Generate economic forecasts for ${country} over ${timeframe}.
  Consider factors like ${factors.join(', ')}. Provide short, medium, and long-term forecasts with scenarios.`;
  
  return generateStructuredData(prompt, ForecastAnalysisSchema, {
    temperature: 0.4
  });
}

export async function analyzeInvestment(country: string, investmentType: string) {
  const prompt = `Analyze investment opportunities in ${country} for ${investmentType}.
  Provide market overview, specific opportunities, risks, and recommendations.`;
  
  return generateStructuredData(prompt, InvestmentAnalysisSchema, {
    temperature: 0.3
  });
}

export async function generatePersonalFinanceAdvice(country: string, incomeLevel: string) {
  const prompt = `Provide comprehensive personal finance advice for someone in ${country} with ${incomeLevel} income.
  Include budgeting, savings, investment, debt management, and retirement planning strategies.`;
  
  return generateStructuredData(prompt, PersonalFinanceSchema, {
    temperature: 0.4
  });
}

export async function analyzePersonalFinance(country: string, income: string, expenses: string, age: string, goals: string[]) {
  const prompt = `Provide comprehensive personal finance analysis for someone in ${country} who is ${age} years old with monthly income of ${income} and monthly expenses of ${expenses}.
  Financial goals include: ${goals.join(', ')}.
  
  Provide detailed analysis including:
  - Financial overview and current situation
  - Budgeting strategies and expense optimization
  - Savings recommendations and emergency fund planning
  - Investment guidance based on age and goals
  - Debt management strategies
  - Retirement planning advice
  - Action items with prioritized implementation timeline`;
  
  return generateStructuredData(prompt, PersonalFinanceSchema, {
    temperature: 0.3
  });
}

export async function analyzeEmployment(country: string): Promise<string> {
  const prompt = `Analyze the employment and unemployment situation in ${country}.
  Include job market trends, sector analysis, skills demand, and recommendations for job seekers and policymakers.`;
  
  return await generateAIText(prompt, 'economicAnalysis');
}

export async function analyzeSavings(country: string): Promise<string> {
  const prompt = `Analyze savings patterns and recommendations for ${country}.
  Include savings rates, investment options, government policies, and strategies for different income levels.`;
  
  return await generateAIText(prompt, 'economicAnalysis');
}

export async function analyzeWages(country: string) {
  const prompt = `Analyze wage trends and income distribution in ${country}.
  Include wage growth, sectoral differences, gender pay gaps, and policy recommendations.`;
  
  return generateAIText(prompt, 'economicAnalysis');
}

export async function analyzeSecurityRisk(country: string) {
  const prompt = `Analyze economic security and risk factors for ${country}.
  Include financial stability, geopolitical risks, economic vulnerabilities, and risk mitigation strategies.`;
  
  return generateAIText(prompt, 'economicAnalysis');
}

export async function analyzePricing(country: string, sector: string) {
  const prompt = `Analyze pricing trends and strategies in ${country} for the ${sector} sector.
  Include price levels, inflation impact, competitive pricing, and consumer behavior.`;
  
  return generateAIText(prompt, 'economicAnalysis');
}

/**
 * AI Provider Library - Streamlined Setup
 * 
 * This library has been optimized to use only the two most reliable providers:
 * - Google Gemini: Fast, reliable, and cost-effective for general text generation
 * - Anthropic Claude: Premium reasoning and structured data generation
 * 
 * Removed providers:
 * - Mistral AI: Authentication issues, removed to reduce complexity
 * - Cohere: Authentication issues, removed to reduce complexity
 * 
 * Features:
 * - Automatic fallback from Gemini to Claude on failures
 * - Structured data generation with Zod schema validation
 * - Comprehensive error handling and user-friendly messages
 * - Support for different task types (economic analysis, podcast generation, etc.)
 */
