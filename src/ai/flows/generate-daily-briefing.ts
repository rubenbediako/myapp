
'use server';

/**
 * @fileOverview A flow for generating a daily news briefing podcast for a specific region.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateDailyBriefingInputSchema = z.object({
  region: z.string().describe("The specific region for the news briefing (e.g., 'Africa', 'Europe', 'Global')."),
});

export type GenerateDailyBriefingInput = z.infer<typeof GenerateDailyBriefingInputSchema>;

const GenerateDailyBriefingOutputSchema = z.object({
  title: z.string().describe("The title of the news briefing."),
  script: z.string().describe("The full podcast script dialogue between Rita and Das."),
});

export type GenerateDailyBriefingOutput = z.infer<typeof GenerateDailyBriefingOutputSchema>;

export async function generateDailyBriefing(input: GenerateDailyBriefingInput): Promise<GenerateDailyBriefingOutput> {
    return generateDailyBriefingFlow(input);
}

const briefingPrompt = ai.definePrompt({
  name: 'generateDailyBriefingPrompt',
  input: { schema: z.object({
      region: z.string(),
      currentDate: z.string(),
  }) },
  output: { schema: z.object({
      title: z.string(),
      script: z.string(),
  }) },
  prompt: `You are an AI news analyst creating a script for a daily economic and financial news briefing for {{{currentDate}}}. The briefing focuses on the {{{region}}} region. The host is Rita (female voice, uses 'Speaker1:' label), and the expert guest is Das (male voice, uses 'Speaker2:' label).

  Your task is to create a full, detailed, and insightful podcast dialogue covering the top 3-4 REAL and VERY LATEST economic or financial news stories of the day relevant to {{{region}}}.
  - IMPORTANT: Do NOT invent, fabricate, or create fictional news. Your analysis must be based on factual, verifiable, real-world data and current events for today, {{{currentDate}}}.
  - If the region is 'Global', provide a worldwide summary of the most important economic news for today.
  
  The output should be:
  - 'title': "Das-AI Daily Briefing: {{{region}}} Update for {{{currentDate}}}"
  - 'script': A natural, in-depth conversation. Rita should introduce the topics and ask probing questions. Das must provide expert analysis, context, and potential implications for each story, based on real economic trends and data. The tone should be professional and analytical.

  Format the entire script as a single string for the 'script' field, ensuring each line of dialogue starts with the correct speaker label. For example:
  Speaker1: Welcome to the Daily Briefing for {{{currentDate}}}. Das, our lead story today in {{{region}}} is...
  Speaker2: That's right, Rita. This development is significant for the region because...
  `,
});

const generateDailyBriefingFlow = ai.defineFlow(
  {
    name: 'generateDailyBriefingFlow',
    inputSchema: GenerateDailyBriefingInputSchema,
    outputSchema: GenerateDailyBriefingOutputSchema,
  },
  async ({ region }) => {
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const { output: scriptOutput } = await briefingPrompt({ region, currentDate });
    if (!scriptOutput || !scriptOutput.script) {
        throw new Error("Failed to generate briefing script.");
    }
    
    return {
        title: scriptOutput.title,
        script: scriptOutput.script,
    };
  }
);
