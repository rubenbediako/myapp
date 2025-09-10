import { google } from '@ai-sdk/google';
import { generateObject, generateText, streamText } from 'ai';
import { z } from 'zod';

// Multi-provider setup for flexibility
export const AI_PROVIDERS = {
  google: {
    fast: google('gemini-1.5-flash'),
    pro: google('gemini-1.5-pro'),
    latest: google('gemini-2.0-flash')
  }
  // Add more providers as needed:
  // openai: {
  //   gpt4: openai('gpt-4o'),
  //   gpt35: openai('gpt-3.5-turbo')
  // }
} as const;

// Simple approach - use the default google provider
// The API key will be automatically read from GOOGLE_GENERATIVE_AI_API_KEY
const defaultModel = AI_PROVIDERS.google.fast;

// Configuration for different AI tasks
export const AI_CONFIG = {
  economicAnalysis: {
    model: AI_PROVIDERS.google.pro,
    temperature: 0.3, // More focused for analysis
    maxTokens: 2000
  },
  podcastGeneration: {
    model: AI_PROVIDERS.google.fast,
    temperature: 0.7, // More creative for conversations
    maxTokens: 4000
  },
  dataProcessing: {
    model: AI_PROVIDERS.google.fast,
    temperature: 0.1, // Very focused for data tasks
    maxTokens: 1000
  }
} as const;

/**
 * Enhanced AI text generation with task-specific configuration
 */
export async function generateAIText(
  prompt: string, 
  task: keyof typeof AI_CONFIG = 'economicAnalysis',
  options?: { temperature?: number; maxTokens?: number }
) {
  try {
    const config = AI_CONFIG[task];
    const { text } = await generateText({
      model: config.model,
      prompt,
      temperature: options?.temperature ?? config.temperature,
      maxTokens: options?.maxTokens ?? config.maxTokens,
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

export async function analyzeEmployment(country: string) {
  const prompt = `Analyze the employment and unemployment situation in ${country}.
  Include job market trends, sector analysis, skills demand, and recommendations for job seekers and policymakers.`;
  
  return generateAIText(prompt, 'economicAnalysis');
}

export async function analyzeSavings(country: string) {
  const prompt = `Analyze savings patterns and recommendations for ${country}.
  Include savings rates, investment options, government policies, and strategies for different income levels.`;
  
  return generateAIText(prompt, 'economicAnalysis');
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
