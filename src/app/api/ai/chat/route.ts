import { createStreamingResponse } from '@/lib/ai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })),
  temperature: z.number().min(0).max(2).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, temperature } = ChatRequestSchema.parse(body);

    // Convert messages to a single prompt for simplicity
    const prompt = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n') + '\n\nAssistant:';

    const result = createStreamingResponse(prompt, {
      temperature: temperature ?? 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
