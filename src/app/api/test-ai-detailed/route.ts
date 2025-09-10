import { GoogleGenerativeAI } from '@google/generative-ai';
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
    
    // Test the model creation with Google AI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.1,
      }
    });
    console.log('Model created successfully');
    
    // Test the API call
    const result = await model.generateContent('Respond with just the word "Hello"');
    const response = await result.response;
    const text = response.text();
    
    console.log('AI response:', text);
    
    return NextResponse.json({
      success: true,
      result: text,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      model: 'gemini-1.5-flash',
      provider: 'Google AI Direct'
    });
    
  } catch (error: any) {
    console.error('Error in test-ai-detailed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
}
