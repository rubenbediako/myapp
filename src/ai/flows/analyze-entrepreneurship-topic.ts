'use server';

/**
 * @fileOverview AI-powered analysis of a specific entrepreneurship topic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeEntrepreneurshipTopicInputSchema = z.object({
  topic: z.string().describe('The entrepreneurship topic to be analyzed in detail.'),
});

export type AnalyzeEntrepreneurshipTopicInput = z.infer<typeof AnalyzeEntrepreneurshipTopicInputSchema>;

const AnalyzeEntrepreneurshipTopicOutputSchema = z.object({
  introduction: z.string().describe("Das's clear and concise introduction to the topic."),
  coreConcepts: z.string().describe("Das's explanation of the fundamental principles and core concepts of the topic."),
  processAndStrategies: z.string().describe("Das's detailed breakdown of the typical process, strategies, and best practices involved."),
  challengesAndSolutions: z.string().describe("Das's analysis of common challenges and pitfalls, along with practical solutions and mitigating strategies."),
  futureOutlook: z.string().describe("Das's insights into the future trends and outlook for this area of entrepreneurship."),
});

export type AnalyzeEntrepreneurshipTopicOutput = z.infer<typeof AnalyzeEntrepreneurshipTopicOutputSchema>;

export async function analyzeEntrepreneurshipTopic(input: AnalyzeEntrepreneurshipTopicInput): Promise<AnalyzeEntrepreneurshipTopicOutput> {
  return analyzeEntrepreneurshipTopicFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeEntrepreneurshipTopicPrompt',
  input: { schema: AnalyzeEntrepreneurshipTopicInputSchema },
  output: { schema: AnalyzeEntrepreneurshipTopicOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice), and the expert guest is Das (male voice), a highly intelligent economist and business strategist. They are doing a deep dive on the topic: '{{{topic}}}'.
  
  Your task is to generate only the responses for Das for the following podcast segments. Rita will ask the questions, and you will provide a comprehensive, end-to-end analysis for each.

  The discussion should cover:
  - Introduction: Rita asks: "Das, today we're diving deep into {{{topic}}}. To start us off, what is it in a nutshell?"
  - Core Concepts: Rita asks: "What are the fundamental principles that entrepreneurs need to understand about this?"
  - Process & Strategies: Rita asks: "Can you walk us through the process from beginning to end? What are the key strategies for success here?"
  - Challenges & Solutions: Rita asks: "What are the most common challenges or pitfalls associated with {{{topic}}}, and how can they be overcome?"
  - Future Outlook: Rita asks: "Finally, what's the future outlook for this? What trends should entrepreneurs be watching?"

  Provide a detailed, expert-level analysis based on internationally accepted business and entrepreneurship principles. Use clear, real-world examples to illustrate your points.`,
});

const analyzeEntrepreneurshipTopicFlow = ai.defineFlow(
  {
    name: 'analyzeEntrepreneurshipTopicFlow',
    inputSchema: AnalyzeEntrepreneurshipTopicInputSchema,
    outputSchema: AnalyzeEntrepreneurshipTopicOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
