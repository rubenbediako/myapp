
'use server';

/**
 * @fileOverview AI-powered economic data analysis flow.
 *
 * - analyzeEconomicData - A function that analyzes economic data and provides insights.
 * - AnalyzeEconomicDataInput - The input type for the analyzeEconomicData function.
 * - AnalyzeEconomicDataOutput - The return type for the analyzeEconomicData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEconomicDataInputSchema = z.object({
  indicator: z.string().describe('The economic indicator being analyzed (e.g., GDP, inflation, unemployment).'),
  region: z.string().describe('The geographical region for the data (e.g., United States, Europe, China).'),
  timePeriod: z.string().describe('The time period for the data (e.g., 2020-2024, Q1 2024).'),
  dataValue: z.number().describe('The value of the economic indicator for the specified region and time period.'),
});

export type AnalyzeEconomicDataInput = z.infer<typeof AnalyzeEconomicDataInputSchema>;

const AnalyzeEconomicDataOutputSchema = z.object({
  analysis: z.string().describe('A short, two-line podcast-style analysis between Rita (Host) and Das (Economist).'),
});

export type AnalyzeEconomicDataOutput = z.infer<typeof AnalyzeEconomicDataOutputSchema>;

export async function analyzeEconomicData(input: AnalyzeEconomicDataInput): Promise<AnalyzeEconomicDataOutput> {
  return analyzeEconomicDataFlow(input);
}

const analyzeEconomicDataPrompt = ai.definePrompt({
  name: 'analyzeEconomicDataPrompt',
  input: {schema: AnalyzeEconomicDataInputSchema},
  output: {schema: AnalyzeEconomicDataOutputSchema},
  prompt: `You are creating a script for a map tooltip. The host is Rita (female voice) and the expert is Das (male voice), a highly intelligent economist.
  
  Your task is to generate a very brief, two-line podcast-style dialogue. The analysis must focus on trend analysis.

  Data:
  - Indicator: {{{indicator}}}
  - Region: {{{region}}}
  - Time Period: {{{timePeriod}}}
  - Value: {{{dataValue}}}

  Format the output exactly as follows, filling in your analysis for Das's line:
  Rita: "Das, what's the story with the {{{indicator}}} in {{{region}}} for {{{timePeriod}}}?"
  Das: "[Your brief, insightful analysis here based on the data, focusing on the historical trend, its direction, and the reason for it.]"

  Generate the analysis based on factual, real-world data and realistic economic trends.
`,
});

const analyzeEconomicDataFlow = ai.defineFlow(
  {
    name: 'analyzeEconomicDataFlow',
    inputSchema: AnalyzeEconomicDataInputSchema,
    outputSchema: AnalyzeEconomicDataOutputSchema,
  },
  async input => {
    const {output} = await analyzeEconomicDataPrompt(input);
    return output!;
  }
);
