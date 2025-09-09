
'use server';

/**
 * @fileOverview AI-powered analysis of a country's government budget.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeGovernmentBudgetInputSchema = z.object({
  country: z.string().describe('The country for which to perform the budget analysis.'),
});

export type AnalyzeGovernmentBudgetInput = z.infer<typeof AnalyzeGovernmentBudgetInputSchema>;

const BudgetItemSchema = z.object({
    name: z.string().describe("The name of the revenue source or expenditure category."),
    value: z.number().describe("The value or percentage for that item."),
});

const AnalyzeGovernmentBudgetOutputSchema = z.object({
  revenueSources: z.object({
      explanation: z.string().describe("Das's overview of the primary sources of government revenue and their historical trends, with specific figures."),
      chartData: z.array(BudgetItemSchema).describe("Data for a chart showing the breakdown of major revenue sources (e.g., Income Tax, Corporate Tax, VAT/Sales Tax).")
  }),
  expenditure: z.object({
      explanation: z.string().describe("Das's overview of the main areas of government spending and their historical trends, with specific figures."),
      chartData: z.array(BudgetItemSchema).describe("Data for a chart showing the breakdown of major expenditure categories (e.g., Healthcare, Defense, Education, Social Security).")
  }),
  fiscalPolicy: z.string().describe("Das's analysis of the country's recent fiscal policy (expansionary or contractionary) and its impact on the economy, supported by data."),
  debtAndDeficit: z.string().describe("Das's explanation of the country's national debt and budget deficit/surplus, including historical context, figures, and future outlook."),
  implications: z.string().describe("Das's insights into the implications of the current budget for citizens and businesses, based on the data."),
});

export type AnalyzeGovernmentBudgetOutput = z.infer<typeof AnalyzeGovernmentBudgetOutputSchema>;

export async function analyzeGovernmentBudget(input: AnalyzeGovernmentBudgetInput): Promise<AnalyzeGovernmentBudgetOutput> {
  return analyzeGovernmentBudgetFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeGovernmentBudgetPrompt',
  input: { schema: AnalyzeGovernmentBudgetInputSchema },
  output: { schema: AnalyzeGovernmentBudgetOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist. They are discussing the government budget of {{{country}}}.
  
  Your task is to generate only the responses for Das for the following podcast segments, with a strong focus on trend analysis and specific data.

  The discussion should cover:
  - Revenue Sources: Rita asks: "Das, where does the government in {{{country}}} get its money? What are the main revenue sources and their historical trends? Please use figures."
    - For this, provide 'chartData' with a breakdown of major revenue sources.
  - Expenditure: Rita asks: "And where does all that money go? What are the key areas of government spending and how have these priorities shifted over time, according to the data?"
    - For this, provide 'chartData' with a breakdown of major spending categories.
  - Fiscal Policy: Rita asks: "Based on this, what can we say about the government's recent fiscal policy? Has it been expansionary or contractionary, and what are the data-driven effects?"
  - Debt and Deficit: Rita asks: "Let's talk about the bottom line. What is the situation with the national debt and budget deficit in {{{country}}}, and what's the long-term trend, with specific numbers?"
  - Implications: Rita asks: "Finally, what does the current budget data mean for the average citizen and businesses in {{{country}}}?"

  Base all of Das's analysis on factual, real-world data and economic principles for {{{country}}}. Your analysis must be grounded in realistic, verifiable economic trends and figures. Emphasize deep trend analysis, historical context, and the use of specific figures in your answers.`,
});

const analyzeGovernmentBudgetFlow = ai.defineFlow(
  {
    name: 'analyzeGovernmentBudgetFlow',
    inputSchema: AnalyzeGovernmentBudgetInputSchema,
    outputSchema: AnalyzeGovernmentBudgetOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
