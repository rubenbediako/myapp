
'use server';

/**
 * @fileOverview AI-powered analysis of a country's savings landscape.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeSavingsLandscapeInputSchema = z.object({
  country: z.string().describe('The country for which to perform the savings analysis.'),
});

export type AnalyzeSavingsLandscapeInput = z.infer<typeof AnalyzeSavingsLandscapeInputSchema>;

const SavingsInstrumentSchema = z.object({
    name: z.string().describe("The name of the savings instrument (e.g., Savings Accounts, Stocks, Real Estate)."),
    popularity: z.number().describe("A score from 1 to 100 representing the popularity of this instrument."),
});

const AnalyzeSavingsLandscapeOutputSchema = z.object({
  savingsCulture: z.string().describe("Das's overview of the savings culture and mindset in the country, including recent data-driven trends."),
  commonInstruments: z.object({
      explanation: z.string().describe("Das's explanation of the most common savings and investment vehicles and their popularity trends, with supporting data."),
      chartData: z.array(SavingsInstrumentSchema).describe("Data for a chart showing the popularity of different savings instruments.")
  }),
  governmentPolicy: z.string().describe("Das's analysis of how government policies affect savings and how this has evolved, with data."),
  futureOutlook: z.string().describe("Das's predictions for the future of savings in the country, based on historical data and trends."),
  advice: z.string().describe("Das's practical savings advice for individuals in the country, considering current data and trends."),
});

export type AnalyzeSavingsLandscapeOutput = z.infer<typeof AnalyzeSavingsLandscapeOutputSchema>;

export async function analyzeSavingsLandscape(input: AnalyzeSavingsLandscapeInput): Promise<AnalyzeSavingsLandscapeOutput> {
  return analyzeSavingsLandscapeFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeSavingsLandscapePrompt',
  input: { schema: AnalyzeSavingsLandscapeInputSchema },
  output: { schema: AnalyzeSavingsLandscapeOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing the savings landscape in {{{country}}}.
  
  Your task is to generate only the responses for Das for the following podcast segments. Rita will ask the questions, and you will provide Das's detailed answers with a strong focus on trend analysis and data.

  The discussion should cover:
  - Savings Culture: Rita asks: "Das, how would you describe the general attitude towards saving money in {{{country}}}, and what are the historical data trends that have shaped this culture?"
  - Common Instruments: Rita asks: "What are the most popular ways for people to save and invest their money here, and how has their popularity trended over time according to the data?"
    - For this segment, also provide 'chartData' with popularity scores for instruments like Savings Accounts, Government Bonds, Stocks/Equities, and Real Estate.
  - Government Policy: Rita asks: "How have government policies and incentives influenced savings habits and data trends over the past decade in {{{country}}}?"
  - Future Outlook: Rita asks: "Based on these deep historical data trends, what does the future hold for savings in {{{country}}}?"
  - Advice for Individuals: Rita asks: "What's your number one piece of savings advice for our listeners in {{{country}}}, given the current and historical data trends?"

  Base all of Das's analysis on factual, real-world data and economic principles for {{{country}}}. Your analysis must be grounded in realistic, verifiable economic trends and figures. Emphasize deep trend analysis, historical context, and the use of specific figures in your answers.`,
});

const analyzeSavingsLandscapeFlow = ai.defineFlow(
  {
    name: 'analyzeSavingsLandscapeFlow',
    inputSchema: AnalyzeSavingsLandscapeInputSchema,
    outputSchema: AnalyzeSavingsLandscapeOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
