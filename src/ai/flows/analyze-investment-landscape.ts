
'use server';

/**
 * @fileOverview AI-powered analysis of a country's investment landscape.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeInvestmentLandscapeInputSchema = z.object({
  country: z.string().describe('The country for which to perform the investment analysis.'),
});

export type AnalyzeInvestmentLandscapeInput = z.infer<typeof AnalyzeInvestmentLandscapeInputSchema>;

const InvestmentTheorySchema = z.object({
    explanation: z.string().describe("Das's explanation of a core investment theory relevant to the country."),
    chartData: z.array(z.object({
        name: z.string().describe("The name of the data point (e.g., year, asset class)."),
        value: z.number().describe("The value of the data point."),
    })).describe("Data for a simple chart illustrating the theory, e.g., risk vs. reward of different asset classes.")
});

const AnalyzeInvestmentLandscapeOutputSchema = z.object({
  investmentTheory: InvestmentTheorySchema,
  lifetimeInvestment: z.string().describe("Das's advice on lifetime investment strategies for different age groups within the country, based on data."),
  opportunities: z.string().describe("Das's identification of key investment opportunities and trends in the country, like specific sectors or asset classes, supported by data."),
  predictions: z.string().describe("Das's predictions for the investment market in the country, based on historical data and trend analysis."),
  intuition: z.string().describe("Das's advice and key intuitions for individual investors in the country, considering market trends and data."),
});

export type AnalyzeInvestmentLandscapeOutput = z.infer<typeof AnalyzeInvestmentLandscapeOutputSchema>;

export async function analyzeInvestmentLandscape(input: AnalyzeInvestmentLandscapeInput): Promise<AnalyzeInvestmentLandscapeOutput> {
  return analyzeInvestmentLandscapeFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeInvestmentLandscapePrompt',
  input: { schema: AnalyzeInvestmentLandscapeInputSchema },
  output: { schema: AnalyzeInvestmentLandscapeOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing the investment landscape in {{{country}}}.
  
  Your task is to generate only the responses for Das for the following podcast segments. Rita will ask the questions, and you will provide Das's detailed answers with a strong focus on trend analysis and data.

  The discussion should cover:
  - Investment Theory: Rita asks: "Das, let's start with a foundational concept. What's a key investment theory we should understand when looking at {{{country}}}?" 
    - For this segment, also provide simple chart data for 'chartData' to illustrate a concept like a basic risk/reward spectrum for asset classes like Stocks, Bonds, and Real Estate in {{{country}}}.
  - Lifetime Investment: Rita asks: "How should our listeners in {{{country}}} think about investing across their lifetime, say from their 20s to their 60s, considering historical market data and trends?"
  - Opportunities: Rita asks: "Where do you see the most promising investment opportunities and what are the underlying trends and data driving them in {{{country}}} right now?"
  - Predictions: Rita asks: "Looking ahead, what are your predictions for the investment market in {{{country}}}, based on a deep analysis of historical data and trends?"
  - Intuition for Individuals: Rita asks: "Finally, what's the most important piece of advice or intuition you can share with an individual investor in {{{country}}}, considering the current data and trends?"

  Base all of Das's analysis on factual, real-world data, economic principles, and common investment strategies. Your analysis must be grounded in realistic, verifiable economic trends and figures. Emphasize deep trend analysis, historical context, and the use of specific figures in your answers. Do not use fictional data.`,
});

const analyzeInvestmentLandscapeFlow = ai.defineFlow(
  {
    name: 'analyzeInvestmentLandscapeFlow',
    inputSchema: AnalyzeInvestmentLandscapeInputSchema,
    outputSchema: AnalyzeInvestmentLandscapeOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
