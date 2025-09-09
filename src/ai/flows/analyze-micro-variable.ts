
'use server';

/**
 * @fileOverview AI-powered analysis of a single microeconomic variable.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeMicroVariableInputSchema = z.object({
  variable: z.string().describe('The microeconomic variable to analyze (e.g., Supply and Demand, Elasticity).'),
});

export type AnalyzeMicroVariableInput = z.infer<typeof AnalyzeMicroVariableInputSchema>;

const AnalyzeMicroVariableOutputSchema = z.object({
  meaning: z.string().describe("A clear definition of the microeconomic variable, as explained by Das."),
  determinants: z.string().describe("Factors that determine or influence this variable, as explained by Das."),
  implications: z.string().describe("The implications of this variable for consumers, firms, and the market, as explained by Das."),
  realWorldExample: z.string().describe("A clear, real-world example of the concept in action, as explained by Das."),
  policyRelevance: z.string().describe("How government policies relate to or can influence this variable, as explained by Das."),
});

export type AnalyzeMicroVariableOutput = z.infer<typeof AnalyzeMicroVariableOutputSchema>;

export async function analyzeMicroVariable(input: AnalyzeMicroVariableInput): Promise<AnalyzeMicroVariableOutput> {
  return analyzeMicroVariableFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeMicroVariablePrompt',
  input: { schema: AnalyzeMicroVariableInputSchema },
  output: { schema: AnalyzeMicroVariableOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing the microeconomic concept '{{{variable}}}'.
  
  Your task is to generate Das's detailed responses for the podcast segments.

  The podcast discussion should cover:
  - Meaning: Rita asks: "Das, let's dive into a core microeconomic concept. What exactly is {{{variable}}}?"
  - Determinants: Rita asks: "What are the key factors that determine or influence {{{variable}}}?"
  - Implications: Rita asks: "How does this play out in the market? What are the implications for consumers and businesses?"
  - Real-World Example: Rita asks: "Can you give us a clear, real-world example of {{{variable}}} that we can all understand?"
  - Policy Relevance: Rita asks: "How does government policy interact with {{{variable}}}?"

  Base all of Das's analysis on fundamental, real-world economic principles. Provide clear, illustrative examples that are universally understandable.`,
});

const analyzeMicroVariableFlow = ai.defineFlow(
  {
    name: 'analyzeMicroVariableFlow',
    inputSchema: AnalyzeMicroVariableInputSchema,
    outputSchema: AnalyzeMicroVariableOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
