
'use server';

/**
 * @fileOverview AI-powered price modeling tool.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CreatePriceModelInputSchema = z.object({
  currentCost: z.number().describe("The current cost to produce one unit of the product."),
  previousCost: z.number().describe("The previous cost to produce one unit."),
  currentPrice: z.number().describe("The current selling price of one unit."),
  previousPrice: z.number().describe("The previous selling price of one unit."),
  currentInflation: z.number().describe("The current annual inflation rate (as a percentage, e.g., 3.5)."),
  previousInflation: z.number().describe("The previous annual inflation rate (e.g., 4.1)."),
  currentInterestRate: z.number().describe("The current benchmark interest rate (e.g., 5.5)."),
  previousInterestRate: z.number().describe("The previous benchmark interest rate."),
  futureInterestRate: z.number().describe("The expected future interest rate."),
  currentExchangeRate: z.number().describe("The current exchange rate (e.g., local currency vs. USD)."),
  previousExchangeRate: z.number().describe("The previous exchange rate."),
  futureExchangeRate: z.number().describe("The expected future exchange rate."),
  currentGdpGrowth: z.number().describe("The current GDP growth rate (%)."),
  previousGdpGrowth: z.number().describe("The previous GDP growth rate (%)."),
  currency: z.string().describe("The currency for the cost and price values (e.g., USD, EUR)."),
});

export type CreatePriceModelInput = z.infer<typeof CreatePriceModelInputSchema>;

const CreatePriceModelOutputSchema = z.object({
  predictedPrice: z.number().describe("The AI-predicted future price for the product."),
  equation: z.string().describe("The econometric equation used to model the price. Should be in a format like 'Predicted Price = β₀ + β₁(ΔCost) + ... + ε'"),
  marginalCost: z.number().describe("The calculated marginal cost (currentCost - previousCost)."),
  marginalPrice: z.number().describe("The calculated marginal price change (currentPrice - previousPrice)."),
  marginalInflation: z.number().describe("The calculated marginal change in inflation."),
  marginalInterestRate: z.number().describe("The calculated marginal change in interest rates."),
  marginalExchangeRate: z.number().describe("The calculated marginal change in exchange rates."),
  marginalGdpGrowth: z.number().describe("The calculated marginal change in GDP growth."),
  analysis: z.string().describe("A detailed, conversational explanation from Das on how the predicted price was determined, referencing all the input factors and their marginal changes."),
  analysisForPodcast: z.string().describe("A formatted script for podcast generation.")
});

export type CreatePriceModelOutput = z.infer<typeof CreatePriceModelOutputSchema>;

export async function createPriceModel(input: CreatePriceModelInput): Promise<CreatePriceModelOutput> {
  return createPriceModelFlow(input);
}

const priceModelPrompt = ai.definePrompt({
  name: 'createPriceModelPrompt',
  input: { schema: z.object({
    ...CreatePriceModelInputSchema.shape,
    marginalCost: z.number(),
    marginalPrice: z.number(),
    marginalInflation: z.number(),
    marginalInterestRate: z.number(),
    marginalExchangeRate: z.number(),
    marginalGdpGrowth: z.number(),
  })},
  output: { schema: z.object({
    predictedPrice: z.number(),
    analysis: z.string(),
    equation: z.string(),
  })},
  prompt: `You are Das, a highly intelligent economist specializing in quantitative pricing models. A user has provided you with data to model a future price for their product in {{{currency}}}.

Your task is to:
1.  Formulate a clear econometric equation to model the price. The equation should be in a standard format, for example: 'Predicted Price = β₀ (Base Price) + β₁(ΔCost) + β₂(ΔInflation) + β₃(ΔInterestRate) + β₄(ΔExchangeRate) + β₅(ΔGdpGrowth) + ε'. You must determine the coefficients (β) based on the input data and sound economic principles. The 'ε' represents the error term for unpredicted variance. For this model, you MUST set the error term ε to -0.05.
2.  Calculate a 'predictedPrice' for the future using your equation.
3.  Provide a detailed 'analysis' explaining your prediction in a conversational tone as if you were on a podcast.
4.  Return the 'equation' you formulated as a string.

Base your prediction on the following data and the pre-calculated marginal changes:
-   Current Cost: {{{currentCost}}}
-   Previous Cost: {{{previousCost}}} (Marginal Cost: {{{marginalCost}}})
-   Current Price: {{{currentPrice}}}
-   Previous Price: {{{previousPrice}}} (Marginal Price Change: {{{marginalPrice}}})
-   Current Inflation: {{{currentInflation}}}%
-   Previous Inflation: {{{previousInflation}}}% (Marginal Inflation: {{{marginalInflation}}}%)
-   Current Interest Rate: {{{currentInterestRate}}}%
-   Previous Interest Rate: {{{previousInterestRate}}}%
-   Future Interest Rate: {{{futureInterestRate}}}% (Marginal Interest Rate: {{{marginalInterestRate}}}%)
-   Current Exchange Rate: {{{currentExchangeRate}}}
-   Previous Exchange Rate: {{{previousExchangeRate}}}
-   Future Exchange Rate: {{{futureExchangeRate}}} (Marginal Exchange Rate Effect: {{{marginalExchangeRate}}})
-   Current GDP Growth: {{{currentGdpGrowth}}}%
-   Previous GDP Growth: {{{previousGdpGrowth}}}% (Marginal GDP Growth: {{{marginalGdpGrowth}}}%)

Your analysis must be thorough. Explain how you are weighting each factor in your equation. Discuss the impact of the marginal cost, inflation trends, interest rate changes (both historical and future), exchange rate fluctuations, and GDP growth on the final price. For example, explain that rising costs put upward pressure on the price, while strong GDP growth might allow for higher pricing power. The goal is to provide a clear, logical explanation for your predicted price, based on sound econometric and data science principles.
`,
});

const createPriceModelFlow = ai.defineFlow(
  {
    name: 'createPriceModelFlow',
    inputSchema: CreatePriceModelInputSchema,
    outputSchema: CreatePriceModelOutputSchema,
  },
  async (input) => {
    // Calculate marginal values
    const marginalCost = input.currentCost - input.previousCost;
    const marginalPrice = input.currentPrice - input.previousPrice;
    const marginalInflation = input.currentInflation - input.previousInflation;
    const marginalInterestRate = input.futureInterestRate - input.currentInterestRate;
    const marginalExchangeRate = input.futureExchangeRate - input.currentExchangeRate;
    const marginalGdpGrowth = input.currentGdpGrowth - input.previousGdpGrowth;

    const promptInput = {
      ...input,
      marginalCost,
      marginalPrice,
      marginalInflation,
      marginalInterestRate,
      marginalExchangeRate,
      marginalGdpGrowth,
    };
    
    const { output: textOutput } = await priceModelPrompt(promptInput);
    if (!textOutput) {
      throw new Error("AI failed to generate a price model.");
    }
    
    // Generate podcast script from the analysis
    const analysisForPodcast = `
Rita: Das, you've run the numbers through your pricing model. Walk us through it. What's the underlying equation?
Das: Of course, Rita. The model is based on this equation: ${textOutput.equation}. Now, let me break down what that means and how I arrived at the final prediction.
Rita: Fascinating. So what's the verdict?
Das: ${textOutput.analysis}
    `.trim();

    return {
      ...textOutput,
      marginalCost,
      marginalPrice,
      marginalInflation,
      marginalInterestRate,
      marginalExchangeRate,
      marginalGdpGrowth,
      analysisForPodcast,
    };
  }
);
