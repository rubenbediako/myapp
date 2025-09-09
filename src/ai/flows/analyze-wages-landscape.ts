
'use server';

/**
 * @fileOverview AI-powered analysis of a country's wages landscape.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeWagesLandscapeInputSchema = z.object({
  country: z.string().describe('The country for which to perform the wages analysis.'),
});

export type AnalyzeWagesLandscapeInput = z.infer<typeof AnalyzeWagesLandscapeInputSchema>;

const WageDistributionSchema = z.object({
    percentile: z.string().describe("The income percentile (e.g., 10th, 50th, 90th)."),
    income: z.number().describe("The approximate annual income for that percentile."),
});

const AnalyzeWagesLandscapeOutputSchema = z.object({
  wageDistribution: z.object({
      explanation: z.string().describe("Das's overview of wage distribution, inequality, and historical trends, with specific figures."),
      chartData: z.array(WageDistributionSchema).describe("Data for a chart showing income at different percentiles.")
  }),
  minimumWage: z.string().describe("Das's analysis of the minimum wage and its economic impact over time, supported by data."),
  laborMarket: z.string().describe("Das's insights into the labor market dynamics and trends affecting wages, with specific data points."),
  futureOutlook: z.string().describe("Das's predictions for the future of wages and salaries, based on data and trends."),
  negotiationAdvice: z.string().describe("Das's advice for individuals on negotiating their salary in the current market, based on data."),
});

export type AnalyzeWagesLandscapeOutput = z.infer<typeof AnalyzeWagesLandscapeOutputSchema>;

export async function analyzeWagesLandscape(input: AnalyzeWagesLandscapeInput): Promise<AnalyzeWagesLandscapeOutput> {
  return analyzeWagesLandscapeFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeWagesLandscapePrompt',
  input: { schema: AnalyzeWagesLandscapeInputSchema },
  output: { schema: AnalyzeWagesLandscapeOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing the wages and salary landscape in {{{country}}}.
  
  Your task is to generate only the responses for Das for the following podcast segments. Rita will ask the questions, and you will provide Das's detailed answers with a strong focus on trend analysis and data.

  The discussion should cover:
  - Wage Distribution: Rita asks: "Das, let's talk about income. How are wages typically distributed across the population in {{{country}}}, and what are the historical trends in inequality? Please use specific figures."
    - For this segment, also provide 'chartData' showing approximate annual income for the 10th, 50th (median), and 90th percentiles.
  - Minimum Wage: Rita asks: "What has been the role and economic impact of the minimum wage over time in {{{country}}}? Analyze the trends with supporting data."
  - Labor Market Dynamics: Rita asks: "What key historical and current data trends in the labor market are influencing wage growth?"
  - Future Outlook: Rita asks: "Looking ahead, what is the outlook for wages in {{{country}}}, based on these deep historical data trends?"
  - Negotiation Advice: Rita asks: "For our listeners, what advice can you offer for negotiating a better salary in this market, considering the data and trends?"

  Base all of Das's analysis on factual, real-world data and labor economic principles for {{{country}}}. Your analysis must be grounded in realistic, verifiable economic trends and figures. Emphasize deep trend analysis, historical context, and the use of specific figures in your answers.`,
});

const analyzeWagesLandscapeFlow = ai.defineFlow(
  {
    name: 'analyzeWagesLandscapeFlow',
    inputSchema: AnalyzeWagesLandscapeInputSchema,
    outputSchema: AnalyzeWagesLandscapeOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
