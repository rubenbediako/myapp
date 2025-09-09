
'use server';

/**
 * @fileOverview AI-powered economic data comparison flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { economicData } from '@/data/economic-data';

const CompareEconomicDataInputSchema = z.object({
  country1: z.string().describe('The first country for comparison.'),
  country2: z.string().describe('The second country for comparison.'),
  indicator: z.string().describe('The economic indicator to compare (e.g., GDP (Billions USD), Inflation Rate (%), Unemployment Rate (%)).'),
  startYear: z.number().describe('The start year for the analysis period.'),
  endYear: z.number().describe('The end year for the analysis period.'),
});

export type CompareEconomicDataInput = z.infer<typeof CompareEconomicDataInputSchema>;

const CompareEconomicDataOutputSchema = z.object({
  analysis: z.string().describe('A detailed narrative analysis in a podcast format between Host Rita and Economist Das, comparing the two countries based on the indicator for the specified year range.'),
  chartData: z.array(z.object({
    year: z.number().describe('The year of the data point.'),
    country1Value: z.number().optional().describe('The value for the first country.'),
    country2Value: z.number().optional().describe('The value for the second country.'),
  })).describe('An array of data points over the selected year range for a comparison chart.'),
});

export type CompareEconomicDataOutput = z.infer<typeof CompareEconomicDataOutputSchema>;

export async function compareEconomicData(input: CompareEconomicDataInput): Promise<CompareEconomicDataOutput> {
  return compareEconomicDataFlow(input);
}

const comparisonPrompt = ai.definePrompt({
  name: 'compareEconomicDataPrompt',
  input: { schema: z.object({
      country1: z.string(),
      country2: z.string(),
      indicator: z.string(),
      startYear: z.number(),
      endYear: z.number(),
      data: z.any(),
  }) },
  output: { schema: CompareEconomicDataOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist.
  
  Your task is to generate a full, conversational podcast script comparing the {{{indicator}}} for {{{country1}}} and {{{country2}}} for the period {{{startYear}}} to {{{endYear}}}.

  The output must include:
  1. A 'chartData' array with the data for the specified year range. The values should be named 'country1Value' and 'country2Value' respectively.
  2. A detailed 'analysis' which is the full podcast dialogue. Rita should ask questions about the comparison. Das's analysis MUST focus on a deep historical trend analysis over the specified period. He should explain the trajectory, the reasons for similarities or differences (citing specific numbers and events), identify key turning points, and discuss the potential economic implications for each country based on the full data provided.

  Use the following historical data as your primary source for the trend analysis:
  {{#each data}}
  Year: {{year}}
  - {{{../country1}}}: {{country1Value}}
  - {{{../country2}}}: {{country2Value}}
  ---
  {{/each}}
  
  Base your analysis on factual, real-world data and provide a rich narrative rooted in trend analysis with specific figures. Your analysis must be grounded in realistic, verifiable economic trends and figures.
  `,
});

const compareEconomicDataFlow = ai.defineFlow(
  {
    name: 'compareEconomicDataFlow',
    inputSchema: CompareEconomicDataInputSchema,
    outputSchema: CompareEconomicDataOutputSchema,
  },
  async (input) => {
    const indicatorData = economicData[input.indicator];
    if (!indicatorData) {
      throw new Error(`Invalid indicator: ${input.indicator}`);
    }

    const historicalData = Object.keys(indicatorData)
      .map(yearStr => parseInt(yearStr))
      .filter(year => year >= input.startYear && year <= input.endYear)
      .sort((a, b) => a - b)
      .map(year => {
        const countryData = indicatorData[year] || {};
        return {
          year: year,
          country1Value: countryData[input.country1],
          country2Value: countryData[input.country2],
        };
      });

    const promptInput = {
      ...input,
      data: historicalData,
    };
    
    const { output } = await comparisonPrompt(promptInput);
    
    if (!output) {
      throw new Error("Failed to get a response from the AI.");
    }
    
    if (!output.chartData || output.chartData.length === 0) {
        output.chartData = historicalData.map(d => ({
            year: d.year,
            country1Value: d.country1Value,
            country2Value: d.country2Value,
        }));
    }

    return output;
  }
);
