
'use server';

/**
 * @fileOverview AI-powered analysis of pricing concepts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzePricingInputSchema = z.object({
  country: z.string().describe('The country for which to provide context-specific examples.'),
});

export type AnalyzePricingInput = z.infer<typeof AnalyzePricingInputSchema>;

const AnalyzePricingOutputSchema = z.object({
  meaning: z.string().describe("Das's explanation of what pricing is and its importance in business and economics."),
  strategies: z.string().describe("Das's overview of common pricing strategies (e.g., cost-plus, value-based, competitive, dynamic) with examples relevant to the country."),
  factors: z.string().describe("Das's analysis of the key factors that influence pricing decisions, such as costs, competition, consumer demand, and perceived value."),
  assetPricing: z.string().describe("Das's clear explanation of how asset prices (like stocks, bonds, and real estate) are determined, touching on concepts like risk, return, and market sentiment."),
  psychology: z.string().describe("Das's insights into the psychology of pricing and how it affects consumer behavior (e.g., charm pricing, price anchoring)."),
});

export type AnalyzePricingOutput = z.infer<typeof AnalyzePricingOutputSchema>;

export async function analyzePricing(input: AnalyzePricingInput): Promise<AnalyzePricingOutput> {
  return analyzePricingFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzePricingPrompt',
  input: { schema: AnalyzePricingInputSchema },
  output: { schema: AnalyzePricingOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing the concept of Pricing, using {{{country}}} for context-specific examples.
  
  Your task is to generate only the responses for Das for the following podcast segments. Rita will ask the questions, and you will provide Das's detailed answers.

  The discussion should cover:
  - Meaning of Pricing: Rita asks: "Das, let's start with a fundamental concept. What exactly do we mean by 'pricing', and why is it so critical for a business?"
  - Pricing Strategies: Rita asks: "What are some of the most common strategies businesses in {{{country}}} use to price their products or services?"
  - Key Factors: Rita asks: "What are the main factors a business here should consider when setting a price?"
  - Asset Pricing: Rita asks: "Let's shift gears a bit. How is the pricing of assets like stocks, bonds, or real estate different from pricing a product? What determines their value?"
  - Psychology of Pricing: Rita asks: "Finally, how does psychology play into all of this? Are there any tricks or common tactics that influence how we perceive a price?"

  Base all of Das's analysis on sound economic and business principles, providing clear, illustrative examples relevant to {{{country}}}.`,
});

const analyzePricingFlow = ai.defineFlow(
  {
    name: 'analyzePricingFlow',
    inputSchema: AnalyzePricingInputSchema,
    outputSchema: AnalyzePricingOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
