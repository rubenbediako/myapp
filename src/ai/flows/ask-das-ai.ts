
'use server';

/**
 * @fileOverview A flow for answering user questions in a podcast format.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AskDasAiInputSchema = z.object({
  query: z.string().describe("The user's question about economics, business, finance, etc."),
});

export type AskDasAiInput = z.infer<typeof AskDasAiInputSchema>;

const PodcastLineSchema = z.object({
  speaker: z.enum(["Speaker1", "Speaker2"]).describe("The speaker, either the Interviewer (Speaker1/Rita) or the Economist (Speaker2/Das)."),
  line: z.string().describe("The line of dialogue for the speaker."),
});

const AskDasAiOutputSchema = z.object({
  podcastScript: z.array(PodcastLineSchema).describe("The full podcast script as an array of speaker lines, answering the user's query."),
});

export type AskDasAiOutput = z.infer<typeof AskDasAiOutputSchema>;

export async function askDasAi(input: AskDasAiInput): Promise<AskDasAiOutput> {
  return askDasAiFlow(input);
}

const askDasPrompt = ai.definePrompt({
  name: 'askDasAiPrompt',
  input: { schema: AskDasAiInputSchema },
  output: { schema: AskDasAiOutputSchema },
  prompt: `You are creating a podcast script. The host is Rita (female voice, use label "Speaker1"). The expert guest is Das (male voice, use label "Speaker2").
  
A user has asked the following question: "{{{query}}}"

Your task is to create a detailed, conversational, and insightful podcast dialogue where Rita and Das discuss and answer this question. 
- Rita should introduce the topic based on the user's query and ask clarifying and follow-up questions to guide the conversation.
- Das should provide the expert analysis, explaining the core concepts, giving real-world examples, and breaking down complex topics into easy-to-understand facts.
- The conversation should flow naturally, like a real podcast interview.
- For any factual data, figures, or economic trends, your analysis must be based on factual, verifiable, real-world data and economic principles.

Format the entire response as a 'podcastScript' array, where each element is an object with 'speaker' ("Speaker1" or "Speaker2") and 'line' keys.
`,
});

const askDasAiFlow = ai.defineFlow(
  {
    name: 'askDasAiFlow',
    inputSchema: AskDasAiInputSchema,
    outputSchema: AskDasAiOutputSchema,
  },
  async (input) => {
    const { output } = await askDasPrompt(input);
    if (!output || !output.podcastScript || output.podcastScript.length === 0) {
      throw new Error("The AI failed to generate a valid podcast script.");
    }
    return output;
  }
);
