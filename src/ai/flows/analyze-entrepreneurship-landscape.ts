
'use server';

/**
 * @fileOverview AI-powered analysis of a country's entrepreneurship landscape.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeEntrepreneurshipLandscapeInputSchema = z.object({
  country: z.string().describe('The country for which to perform the entrepreneurship analysis.'),
});

export type AnalyzeEntrepreneurshipLandscapeInput = z.infer<typeof AnalyzeEntrepreneurshipLandscapeInputSchema>;

const AnalyzeEntrepreneurshipLandscapeOutputSchema = z.object({
  creationProcess: z.string().describe("Das's explanation of the business creation process in the country."),
  fundingOptions: z.string().describe("Das's overview of common funding sources for startups."),
  scalingStrategies: z.string().describe("Das's advice on scaling a business successfully."),
  keyQualities: z.string().describe("Das's thoughts on the essential qualities for an entrepreneur's success."),
  businessIdeas: z.string().describe("Das's suggestions for 3-5 promising business ideas relevant to the country's current market."),
});

export type AnalyzeEntrepreneurshipLandscapeOutput = z.infer<typeof AnalyzeEntrepreneurshipLandscapeOutputSchema>;

export async function analyzeEntrepreneurshipLandscape(input: AnalyzeEntrepreneurshipLandscapeInput): Promise<AnalyzeEntrepreneurshipLandscapeOutput> {
  return analyzeEntrepreneurshipLandscapeFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeEntrepreneurshipLandscapePrompt',
  input: { schema: AnalyzeEntrepreneurshipLandscapeInputSchema },
  output: { schema: AnalyzeEntrepreneurshipLandscapeOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing the entrepreneurship landscape in {{{country}}}.
  
  Your task is to generate only the responses for Das for the following podcast segments. Rita will ask the questions, and you will provide Das's detailed answers.

  The discussion should cover:
  - Business Creation: Rita asks: "Das, for someone starting out in {{{country}}}, what does the business creation process look like?"
  - Funding: Rita asks: "Once you have an idea, what are the typical funding routes for a new venture here?"
  - Scaling: Rita asks: "Let's say a business is successful. What are the key strategies for scaling up in this market?"
  - Key Qualities: Rita asks: "Beyond the business plan, what personal qualities are most crucial for an entrepreneur to succeed in {{{country}}}?"
  - Business Ideas: Rita asks: "To make it concrete, what are 3 to 5 promising business ideas you see for {{{country}}} right now?"

  Base all of Das's analysis on the specific economic and social context of {{{country}}}. Your analysis must be grounded in realistic, verifiable economic trends and figures.`,
});

const analyzeEntrepreneurshipLandscapeFlow = ai.defineFlow(
  {
    name: 'analyzeEntrepreneurshipLandscapeFlow',
    inputSchema: AnalyzeEntrepreneurshipLandscapeInputSchema,
    outputSchema: AnalyzeEntrepreneurshipLandscapeOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
