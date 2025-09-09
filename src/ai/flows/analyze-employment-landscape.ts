
'use server';

/**
 * @fileOverview AI-powered analysis of a country's employment and unemployment landscape.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeEmploymentLandscapeInputSchema = z.object({
  country: z.string().describe('The country for which to perform the employment analysis.'),
});

export type AnalyzeEmploymentLandscapeInput = z.infer<typeof AnalyzeEmploymentLandscapeInputSchema>;

const AnalyzeEmploymentLandscapeOutputSchema = z.object({
  meaning: z.string().describe("Das's explanation of what employment and unemployment mean in economics."),
  theories: z.string().describe("Das's overview of key economic theories that explain unemployment (e.g., Classical, Keynesian, Frictional, Structural)."),
  causes: z.string().describe("Das's analysis of the primary causes of unemployment specific to the selected country, including historical context and data-driven trends."),
  policies: z.string().describe("Das's description of government policies used to combat unemployment in the country and their historical effectiveness, supported by data."),
  advice: z.string().describe("Das's practical advice for job seekers in the current labor market of the country, based on recent data and trends."),
});

export type AnalyzeEmploymentLandscapeOutput = z.infer<typeof AnalyzeEmploymentLandscapeOutputSchema>;

export async function analyzeEmploymentLandscape(input: AnalyzeEmploymentLandscapeInput): Promise<AnalyzeEmploymentLandscapeOutput> {
  return analyzeEmploymentLandscapeFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeEmploymentLandscapePrompt',
  input: { schema: AnalyzeEmploymentLandscapeInputSchema },
  output: { schema: AnalyzeEmploymentLandscapeOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing the employment and unemployment landscape in {{{country}}}.
  
  Your task is to generate only the responses for Das for the following podcast segments. Rita will ask the questions, and you will provide Das's detailed answers with a strong focus on trend analysis and data.

  The discussion should cover:
  - Meaning: Rita asks: "Das, let's start with the basics. What do economists mean by 'employment' and 'unemployment'?"
  - Theories: Rita asks: "What are some of the key theories that explain why unemployment exists?"
  - Causes in {{{country}}}: Rita asks: "Focusing on {{{country}}}, what are the main historical and current causes of unemployment here? Please provide the key data and long-term trends."
  - Government Policies: Rita asks: "How has the government in {{{country}}} typically tried to address these issues, and what have the trends in policy effectiveness been over the last decade, according to the data?"
  - Advice for Job Seekers: Rita asks: "Finally, based on current data and historical trends, what is your key piece of advice for job seekers in {{{country}}} right now?"

  Base all of Das's analysis on factual, real-world data and labor economic principles for {{{country}}}. Your analysis must be grounded in realistic, verifiable economic trends and figures. Emphasize deep trend analysis, historical context, and the use of specific figures in your answers.`,
});

const analyzeEmploymentLandscapeFlow = ai.defineFlow(
  {
    name: 'analyzeEmploymentLandscapeFlow',
    inputSchema: AnalyzeEmploymentLandscapeInputSchema,
    outputSchema: AnalyzeEmploymentLandscapeOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
