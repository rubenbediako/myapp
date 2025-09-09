
'use server';

/**
 * @fileOverview AI-powered analysis of a country's capital market.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeCapitalMarketInputSchema = z.object({
  country: z.string().describe('The country for which to perform the capital market analysis.'),
});

export type AnalyzeCapitalMarketInput = z.infer<typeof AnalyzeCapitalMarketInputSchema>;

const AnalyzeCapitalMarketOutputSchema = z.object({
  understanding: z.string().describe("Das's explanation of what a capital market is and its role in the economy."),
  investing: z
    .string()
    .describe(
      "Das's overview of how individuals and institutions can invest in the country's capital market."
    ),
  performance: z
    .string()
    .describe(
      "Das's analysis of the recent performance and key trends of the country's main stock market index."
    ),
  bondPrices: z
    .string()
    .describe(
      "Das's explanation of how bond prices are determined and their relationship with interest rates."
    ),
  whenToInvest: z
    .string()
    .describe(
      "Das's advice on market timing and the factors to consider when deciding when to invest, based on historical trends."
    ),
});

export type AnalyzeCapitalMarketOutput = z.infer<
  typeof AnalyzeCapitalMarketOutputSchema
>;

export async function analyzeCapitalMarket(
  input: AnalyzeCapitalMarketInput
): Promise<AnalyzeCapitalMarketOutput> {
  return analyzeCapitalMarketFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeCapitalMarketPrompt',
  input: { schema: AnalyzeCapitalMarketInputSchema },
  output: { schema: AnalyzeCapitalMarketOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing the capital market in {{{country}}}.
  
  Your task is to generate only the responses for Das for the following podcast segments. Rita will ask the questions, and you will provide Das's detailed answers.

  The discussion should cover:
  - Understanding: Rita asks: "Das, let's break it down. What exactly is the capital market and why is it important for {{{country}}}'s economy?"
  - Investing: Rita asks: "How can an ordinary person or an institution start investing in the capital market here?"
  - Market Performance: Rita asks: "How has the stock market in {{{country}}} been performing? What are the key historical trends and what's driving them? Please use specific figures and data points."
  - Bond Prices: Rita asks: "Let's talk about the other side of the market. How are bond prices determined, and what is their relationship with interest rates? What are the trends here, with supporting data?"
  - When to Invest: Rita asks: "This is the million-dollar question for many: is there a 'right' time to invest, and what factors should people consider based on historical trends and data?"

  Base all of Das's analysis on factual, real-world data and financial principles for {{{country}}}. Your analysis must be grounded in realistic, verifiable economic trends and figures. Provide clear, insightful explanations with a focus on deep trend analysis, citing specific data and figures to support your points.`,
});

const analyzeCapitalMarketFlow = ai.defineFlow(
  {
    name: 'analyzeCapitalMarketFlow',
    inputSchema: AnalyzeCapitalMarketInputSchema,
    outputSchema: AnalyzeCapitalMarketOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
