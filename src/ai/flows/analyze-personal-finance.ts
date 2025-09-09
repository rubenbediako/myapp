
'use server';

/**
 * @fileOverview AI-powered personal finance advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzePersonalFinanceInputSchema = z.object({
  country: z.string().describe('The country for which to provide personal finance advice.'),
});

export type AnalyzePersonalFinanceInput = z.infer<typeof AnalyzePersonalFinanceInputSchema>;

const AnalyzePersonalFinanceOutputSchema = z.object({
  economicTrendsAdvice: z.string().describe("Das's key financial advice based on current and future economic trends and data in the country."),
  budgetingAdvice: z.string().describe("Das's practical advice on budgeting and managing day-to-day expenses, considering economic trends and data."),
  revenueStreamsAdvice: z.string().describe("Das's insights on diversifying and increasing revenue streams in the current economic climate, based on data and trends."),
  personalManagementAdvice: z.string().describe("Das's advice on overall personal financial management, including goal setting and mindset, adjusted for data-driven trends."),
  understandingFinances: z.string().describe("Das's explanation on how to get a better understanding of one's personal financial situation."),
});

export type AnalyzePersonalFinanceOutput = z.infer<typeof AnalyzePersonalFinanceOutputSchema>;

export async function analyzePersonalFinance(input: AnalyzePersonalFinanceInput): Promise<AnalyzePersonalFinanceOutput> {
  return analyzePersonalFinanceFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzePersonalFinancePrompt',
  input: { schema: AnalyzePersonalFinanceInputSchema },
  output: { schema: AnalyzePersonalFinanceOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing personal finance for individuals in {{{country}}}.
  
  Your task is to generate only the responses for Das for the following podcast segments. Rita will ask the questions, and you will provide Das's detailed answers with a strong focus on data-driven trend analysis.

  The discussion should cover:
  - Understanding Your Finances: Rita asks: "Das, let's talk about personal finance. To start, how can someone gain a better understanding of their finances in {{{country}}}?"
  - Budgeting Advice: Rita asks: "With that foundation, what is your advice on budgeting effectively given the current and historical economic data and trends?"
  - Revenue Streams: Rita asks: "Beyond budgeting, how should people think about their revenue streams in light of economic changes and long-term data trends?"
  - Personal Management: Rita asks: "What's your advice for overall personal financial management, considering the economic environment and its historical data and trends?"
  - Advice Based on Economic Trends: Rita asks: "Finally, based on a deep analysis of historical and current economic data and trends, what's your key piece of financial advice for our listeners in {{{country}}}?"

  Base all of Das's analysis on factual, real-world data and sound financial principles relevant to {{{country}}}. Your analysis must be grounded in realistic, verifiable economic trends and figures. Emphasize the impact of deep, data-driven economic trend analysis on personal finance.`,
});

const analyzePersonalFinanceFlow = ai.defineFlow(
  {
    name: 'analyzePersonalFinanceFlow',
    inputSchema: AnalyzePersonalFinanceInputSchema,
    outputSchema: AnalyzePersonalFinanceOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
