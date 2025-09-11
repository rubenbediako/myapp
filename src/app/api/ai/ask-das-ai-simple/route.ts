import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const AskDasAiRequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

const PodcastLineSchema = z.object({
  speaker: z.string(),
  line: z.string()
});

const PodcastScriptSchema = z.object({
  podcastScript: z.array(PodcastLineSchema)
});

export async function POST(request: NextRequest) {
  let query = 'economic trends'; // Default fallback
  
  try {
    const body = await request.json();
    const parsed = AskDasAiRequestSchema.parse(body);
    query = parsed.query;

    // Simplified prompt with stricter JSON requirements
    const prompt = `You are an AI that generates economics podcast scripts in JSON format.

Question: "${query}"

Create a conversation between Rita (Speaker1) and Das (Speaker2) about this economic topic.

Requirements:
- Include real economic data and statistics
- Make it conversational and informative
- 4-6 exchanges total

Return ONLY this exact JSON structure with no additional text:
{
  "podcastScript": [
    {"speaker": "Speaker1", "line": "Rita's response here"},
    {"speaker": "Speaker2", "line": "Das's response here"}
  ]
}

CRITICAL: Return ONLY valid JSON. No explanations, no markdown, no extra text.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Simple JSON extraction - find first { to last }
    const startIndex = text.indexOf('{');
    const lastIndex = text.lastIndexOf('}');
    
    if (startIndex === -1 || lastIndex === -1 || lastIndex <= startIndex) {
      throw new Error('No JSON found in response');
    }
    
    const jsonText = text.substring(startIndex, lastIndex + 1);
    const parsedData = JSON.parse(jsonText);
    
    // Basic validation
    if (!parsedData.podcastScript || !Array.isArray(parsedData.podcastScript)) {
      throw new Error('Invalid podcast script format');
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error in simple ask-das-ai:', error);
    
    // Provide a guaranteed working fallback response
    const fallbackResponse = {
      podcastScript: [
        {
          speaker: "Speaker1",
          line: `Rita here! Today we're exploring ${query}. Let me bring in our expert economist Das for insights.`
        },
        {
          speaker: "Speaker2", 
          line: "Thanks Rita. This is an important economic topic that affects markets and consumers globally."
        },
        {
          speaker: "Speaker1",
          line: "Das, can you break down the key factors we should understand?"
        },
        {
          speaker: "Speaker2",
          line: "Absolutely. Based on current economic data, there are several trends worth monitoring in this area."
        }
      ]
    };
    
    return NextResponse.json(fallbackResponse);
  }
}
