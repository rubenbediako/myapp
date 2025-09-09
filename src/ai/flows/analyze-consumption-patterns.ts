
'use server';

/**
 * @fileOverview AI-powered analysis of a country's consumption patterns.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeConsumptionPatternsInputSchema = z.object({
  country: z.string().describe('The country for which to perform the consumption analysis.'),
});

export type AnalyzeConsumptionPatternsInput = z.infer<typeof AnalyzeConsumptionPatternsInputSchema>;

const SpendingCategorySchema = z.object({
    category: z.string().describe("The spending category (e.g., Housing, Food, Transportation)."),
    percentage: z.number().describe("The percentage of income spent on this category."),
});

const AnalyzeConsumptionPatternsOutputSchema = z.object({
  keyDrivers: z.string().describe("Das's explanation of the main drivers of consumption in the country, including historical trends and specific data points."),
  spendingHabits: z.object({
      explanation: z.string().describe("Das's overview of typical household spending habits and recent trends, supported by figures."),
      chartData: z.array(SpendingCategorySchema).describe("Data for a chart showing spending breakdown by category.")
  }),
  creditAndDebt: z.string().describe("Das's analysis of the role and trends of credit and debt in consumption, using relevant data."),
  futureTrends: z.string().describe("Das's predictions for future consumption trends based on historical data and trend analysis."),
  advice: z.string().describe("Das's advice for consumers in the country based on the current economic trends and data."),
});

export type AnalyzeConsumptionPatternsOutput = z.infer<typeof AnalyzeConsumptionPatternsOutputSchema>;

export async function analyzeConsumptionPatterns(input: AnalyzeConsumptionPatternsInput): Promise<AnalyzeConsumptionPatternsOutput> {
  return analyzeConsumptionPatternsFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeConsumptionPatternsPrompt',
  input: { schema: AnalyzeConsumptionPatternsInputSchema },
  output: { schema: AnalyzeConsumptionPatternsOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing consumption patterns in {{{country}}}.
  
  Your task is to generate only the responses for Das for the following podcast segments. Rita will ask the questions, and you will provide Das's detailed answers with a strong focus on trend analysis.

  The discussion should cover:
  - Key Drivers: Rita asks: "Das, what are the primary factors and historical trends driving consumer spending in {{{country}}}? Please include specific data."
  - Spending Habits: Rita asks: "How do households in {{{country}}} typically allocate their budgets, and how has that changed over time? What are the trends, supported by figures?"
    - For this segment, also provide 'chartData' with a simple breakdown of spending for categories like Housing, Food, Transportation, Healthcare, and Discretionary spending.
  - Role of Credit and Debt: Rita asks: "How have credit and debt shaped consumption habits here over the past few years? What are the key trends and the data behind them?"
  - Future Trends: Rita asks: "Based on these deep historical trends and data, what future direction do you see for consumption in {{{country}}}?"
  - Advice for Consumers: Rita asks: "Finally, what's one piece of advice you'd give to consumers in {{{country}}} based on these data-driven trends?"

  Base all of Das's analysis on factual, real-world data and economic principles for {{{country}}}. Your analysis must be grounded in realistic, verifiable economic trends and figures. Emphasize deep trend analysis, historical context, and the use of specific figures in your answers.`,
});

const analyzeConsumptionPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeConsumptionPatternsFlow',
    inputSchema: AnalyzeConsumptionPatternsInputSchema,
    outputSchema: AnalyzeConsumptionPatternsOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
