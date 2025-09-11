import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function GET() {
  try {
    // Test Claude with a simple request
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 100,
      temperature: 0.1,
      messages: [
        {
          role: 'user',
          content: 'Say "Claude is working!" in JSON format: {"message": "your response"}'
        }
      ]
    });
    
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    return NextResponse.json({
      success: true,
      claudeResponse: text,
      usage: response.usage
    });
  } catch (error) {
    console.error('Claude test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}
