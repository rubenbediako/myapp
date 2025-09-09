
'use server';

/**
 * @fileOverview AI-powered analysis of a single macroeconomic variable.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeMacroVariableInputSchema = z.object({
  variable: z.string().describe('The macroeconomic variable to analyze (e.g., GDP, Inflation, Unemployment).'),
  country: z.string().describe('The country for which to perform the analysis.'),
});

export type AnalyzeMacroVariableInput = z.infer<typeof AnalyzeMacroVariableInputSchema>;

const AnalyzeMacroVariableOutputSchema = z.object({
  meaning: z.string().describe("A clear definition of the macroeconomic variable, as explained by Das."),
  measurement: z.string().describe("How the variable is typically measured, as explained by Das."),
  forwardEffects: z.string().describe("The forward transmission mechanisms and effects, as explained by Das, with a focus on data-driven trend analysis."),
  backwardEffects: z.string().describe("The backward transmission mechanisms and factors, as explained by Das, with a focus on data-driven trend analysis."),
  control: z.string().describe("Methods and policies used to control the variable, as explained by Das, referencing historical data and trends."),
  intuition: z.object({
    life: z.string().describe("How the variable's trend and data affect daily life, as explained by Das."),
    government: z.string().describe("How the variable's trend and data affect government policy, as explained by Das."),
    firms: z.string().describe("How the variable's trend and data affect businesses, as explained by Das."),
  }),
  prediction: z.string().describe("A prediction of the future behavior of the variable, based on its historical trend and data, as explained by Das."),
});

export type AnalyzeMacroVariableOutput = z.infer<typeof AnalyzeMacroVariableOutputSchema>;

export async function analyzeMacroVariable(input: AnalyzeMacroVariableInput): Promise<AnalyzeMacroVariableOutput> {
  return analyzeMacroVariableFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeMacroVariablePrompt',
  input: { schema: AnalyzeMacroVariableInputSchema },
  output: { schema: AnalyzeMacroVariableOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing the macroeconomic variable '{{{variable}}}' for {{{country}}}.
  
  Your task is to generate only the responses for Das for the following podcast segments. Rita will ask the questions, and you will provide Das's detailed answers with a strong focus on trend analysis and specific data.

  The discussion should cover:
  - Meaning: Rita asks: "Das, let's start with the basics. What exactly is {{{variable}}}?"
  - Measurement: Rita asks: "How do economists and governments actually measure that?"
  - Forward & Backward Effects: Rita asks: "Could you break down the chain reactions? What influences {{{variable}}} and what does it affect downstream? Discuss the historical trends in detail, using specific data."
  - Control: Rita asks: "So who is in the driver's seat? How is {{{variable}}} controlled, and how have those methods evolved over time based on past data and trends?"
  - Intuition: Rita asks: "Let's make this real for our listeners. Based on the data, how does the trend of {{{variable}}} impact daily life, government decisions, and businesses?"
  - Prediction: Rita asks: "Finally, the big question. Looking at {{{country}}}'s historical trend and data for {{{variable}}}, what's your prediction for it in the near future?"

  Base all of Das's analysis on factual, real-world data and economic principles. Your analysis must be grounded in realistic, verifiable economic trends and figures. Emphasize deep trend analysis, historical context, and the use of specific figures in your answers. Do not use fictional data.`,
});

const analyzeMacroVariableFlow = ai.defineFlow(
  {
    name: 'analyzeMacroVariableFlow',
    inputSchema: AnalyzeMacroVariableInputSchema,
    outputSchema: AnalyzeMacroVariableOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
