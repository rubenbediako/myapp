
'use server';

/**
 * @fileOverview AI-powered economic data forecasting flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ForecastEconomicDataInputSchema = z.object({
  country: z.string().describe('The country for the forecast.'),
  indicators: z.array(z.string()).describe('The economic indicators to forecast (e.g., GDP Growth (%), Inflation Rate (%), Unemployment Rate (%), Exchange Rate (vs USD), etc.).'),
  period: z.string().describe('The time period for the forecast (e.g., 3 months, 1 year, 5 years).'),
});

export type ForecastEconomicDataInput = z.infer<typeof ForecastEconomicDataInputSchema>;

const PodcastLineSchema = z.object({
  speaker: z.enum(["Rita", "Das"]).describe("The speaker, either the Host (Rita) or the Economist (Das)."),
  line: z.string().describe("The line of dialogue for the speaker."),
});

const SingleIndicatorForecastSchema = z.object({
    indicator: z.string().describe('The economic indicator being forecasted.'),
    chartData: z.array(z.object({
        period: z.string().describe('The forecast period (e.g., Year 1, Q1, Month 1).'),
        value: z.number().describe('The forecasted value for the indicator in that period.'),
    })).describe('An array of data points for the forecast period to be used in a chart.'),
    detailedAnalysis: z.object({
        explanation: z.string().describe("Das's detailed explanation of the factors and data driving the forecast for this indicator, grounded in historical trends."),
        intuition: z.object({
            life: z.string().describe("Das's explanation of how the forecast affects daily life for individuals, with examples."),
            government: z.string().describe("Das's explanation of how the forecast affects government policy, with examples."),
            firms: z.string().describe("Das's explanation of how the forecast affects businesses and firms, with examples."),
        }),
    }).describe("A detailed breakdown of the forecast reasoning and its implications for this specific indicator.")
});

const ForecastEconomicDataOutputSchema = z.object({
  title: z.string().describe("The title of the podcast episode covering all indicators."),
  podcastScript: z.array(PodcastLineSchema).describe("The full podcast script as an array of speaker lines, discussing all selected indicators."),
  indicatorForecasts: z.array(SingleIndicatorForecastSchema).describe("An array of forecast results, one for each requested indicator."),
});


export type ForecastEconomicDataOutput = z.infer<typeof ForecastEconomicDataOutputSchema>;

export async function forecastEconomicData(input: ForecastEconomicDataInput): Promise<ForecastEconomicDataOutput> {
  return forecastEconomicDataFlow(input);
}

const forecastPrompt = ai.definePrompt({
  name: 'forecastEconomicDataPrompt',
  input: { schema: ForecastEconomicDataInputSchema },
  output: { schema: ForecastEconomicDataOutputSchema },
  prompt: `You are creating an economic podcast episode. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist.
  
  Your task is to generate a {{{period}}} forecast for the following indicators in {{{country}}}:
  {{#each indicators}}
  - {{{this}}}
  {{/each}}

  Your response must be a full podcast episode with:
  1. A 'title' for the episode, like "Economic Forecast for {{{country}}}: {{{indicators}}}".
  2. A single, combined 'podcastScript' array. This should be a detailed, conversational dialogue where Rita asks questions and Das provides the forecast for ALL indicators.
     Das's analysis must be comprehensive and heavily based on trend analysis, covering:
     - The historical trend and specific data for each indicator in {{{country}}} and how it informs the predictions.
     - The predicted trend and figures for each indicator over the {{{period}}}.
     - The key economic reasons and drivers behind each forecast, linking them to past performance and specific data points.
     - The potential future implications of these trends for individuals, firms, and government policy in {{{country}}}.
     - A clear "way forward" or key takeaway for listeners based on this data-driven trend analysis.
  3. An 'indicatorForecasts' array. For EACH indicator requested, provide a separate object containing:
     - The 'indicator' name.
     - A 'chartData' array with forecasted data points for the specified {{{period}}}. The 'period' key in the chart data should reflect the forecast increments (e.g., Year 1, Q1, Month 1).
     - A 'detailedAnalysis' object containing:
        - A deeper 'explanation' of the forecast drivers for that indicator, grounded in historical data and trends.
        - An 'intuition' object explaining the specific impact of that indicator's forecast on 'life' (individuals), 'government', and 'firms'.

  Base your forecast and analysis on factual, real-world data and economic principles. Your analysis must be grounded in realistic, verifiable economic trends and figures. Emphasize historical trend analysis and specific figures as the foundation for your predictions.
  `,
});


const forecastEconomicDataFlow = ai.defineFlow(
  {
    name: 'forecastEconomicDataFlow',
    inputSchema: ForecastEconomicDataInputSchema,
    outputSchema: ForecastEconomicDataOutputSchema,
  },
  async (input) => {
    const { output } = await forecastPrompt(input);
    return output!;
  }
);
