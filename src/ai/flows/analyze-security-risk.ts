
'use server';

/**
 * @fileOverview AI-powered analysis of a country's security and risk landscape.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeSecurityRiskInputSchema = z.object({
  country: z.string().describe('The country for which to perform the security and risk analysis.'),
  risks: z.string().describe('A description of the specific risks the user is interested in (e.g., theft, cybersecurity, political instability).'),
});

export type AnalyzeSecurityRiskInput = z.infer<typeof AnalyzeSecurityRiskInputSchema>;

const AnalyzeSecurityRiskOutputSchema = z.object({
  analysis: z.string().describe("A detailed podcast-style dialogue between Rita and Das discussing the specified risks in the given country. It should cover the current situation, potential impacts, future outlook based on trends, and mitigating factors."),
});

export type AnalyzeSecurityRiskOutput = z.infer<typeof AnalyzeSecurityRiskOutputSchema>;

export async function analyzeSecurityRisk(input: AnalyzeSecurityRiskInput): Promise<AnalyzeSecurityRiskOutput> {
  return analyzeSecurityRiskFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeSecurityRiskPrompt',
  input: { schema: AnalyzeSecurityRiskInputSchema },
  output: { schema: AnalyzeSecurityRiskOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist and risk analyst. They are discussing the security and risk landscape in {{{country}}}.
  
  The user is specifically interested in the following risks: "{{{risks}}}"

  Your task is to generate a detailed, conversational podcast script where Rita asks questions about these specific risks, and Das provides a comprehensive analysis. Das should cover:
  - The current state and historical trends of each specified risk in {{{country}}}, supported by real data and figures where possible.
  - The potential impact on individuals, businesses, or travelers, explained with data.
  - Future outlook: What are the emerging trends and potential future risks? Is there any "incoming danger" the data and historical trends suggest?
  - Any known mitigating factors, preventative security measures, government actions, or general advice based on these data-driven trends.
  
  Base all of Das's analysis on factual, real-world data and geopolitical principles for {{{country}}}. Your analysis must be grounded in realistic, verifiable trends and figures. Provide clear, insightful, and balanced explanations rooted in trend analysis and specific data. The output should be a single string for the 'analysis' field.`,
});

const analyzeSecurityRiskFlow = ai.defineFlow(
  {
    name: 'analyzeSecurityRiskFlow',
    inputSchema: AnalyzeSecurityRiskInputSchema,
    outputSchema: AnalyzeSecurityRiskOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
