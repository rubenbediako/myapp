import { generateStructuredData, PodcastScriptSchema } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const AskDasAiRequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = AskDasAiRequestSchema.parse(body);

    const prompt = `You are creating a podcast script. The host is Rita (female voice, use label "Speaker1"). The expert guest is Das (male voice, use label "Speaker2").
  
A user has asked the following question: "${query}"

Your task is to create a detailed, conversational, and insightful podcast dialogue where Rita and Das discuss and answer this question. 
- Rita should introduce the topic based on the user's query and ask clarifying and follow-up questions to guide the conversation.
- Das should provide the expert analysis, explaining the core concepts, giving real-world examples, and breaking down complex topics into easy-to-understand facts.
- The conversation should flow naturally, like a real podcast interview.
- For any factual data, figures, or economic trends, your analysis must be based on factual, verifiable, real-world data and economic principles.

Format the entire response as a 'podcastScript' array, where each element is an object with 'speaker' ("Speaker1" or "Speaker2") and 'line' keys.`;

    const result = await generateStructuredData(prompt, PodcastScriptSchema);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in ask-das-ai:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to generate podcast script', details: errorMessage },
      { status: 500 }
    );
  }
}
