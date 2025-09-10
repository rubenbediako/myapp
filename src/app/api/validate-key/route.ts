import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('=== API Key Validation Test ===');
  
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const altApiKey = process.env.GOOGLE_GENAI_API_KEY;
  
  console.log('GOOGLE_GENERATIVE_AI_API_KEY exists:', !!apiKey);
  console.log('GOOGLE_GENAI_API_KEY exists:', !!altApiKey);
  
  if (apiKey) {
    console.log('API Key format check:', {
      length: apiKey.length,
      startsWithAIza: apiKey.startsWith('AIza'),
      prefix: apiKey.substring(0, 15) + '...'
    });
  }
  
  // Test a simple fetch to Google's API
  if (apiKey) {
    try {
      console.log('Testing direct API call...');
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models',
        {
          headers: {
            'x-goog-api-key': apiKey,
          },
        }
      );
      
      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const models = await response.json();
        console.log('Available models count:', models.models?.length || 0);
        
        return NextResponse.json({
          success: true,
          message: 'API key is valid',
          modelsCount: models.models?.length || 0,
          firstModel: models.models?.[0]?.name || 'None'
        });
      } else {
        const errorData = await response.json();
        console.log('API Error:', errorData);
        
        return NextResponse.json({
          success: false,
          error: 'API key validation failed',
          status: response.status,
          details: errorData
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      return NextResponse.json({
        success: false,
        error: 'Network error during API validation',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return NextResponse.json({
    success: false,
    error: 'No API key found'
  });
}
