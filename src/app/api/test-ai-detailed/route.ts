import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key not found',
        envCheck: 'GOOGLE_GENERATIVE_AI_API_KEY is not set'
      });
    }
    
    console.log('API Key found:', apiKey.substring(0, 10) + '...');
    
    // Test the model creation with explicit provider
    const googleProvider = createGoogleGenerativeAI({
      apiKey: apiKey,
    });
    const model = googleProvider('gemini-1.5-flash');
    console.log('Model created successfully');
    
    // Test the API call
    const { text } = await generateText({
      model,
      prompt: 'Respond with just the word "Hello"',
      temperature: 0.1,
    });
    
    console.log('AI response:', text);
    
    return NextResponse.json({
      success: true,
      result: text,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
    });
    
  } catch (error) {
    console.error('Detailed AI test error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      stack: errorStack,
      hasApiKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    }, { status: 500 });
  }
}
