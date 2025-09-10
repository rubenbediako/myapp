import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    return NextResponse.json({
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey ? `${apiKey.substring(0, 10)}...` : null,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('GOOGLE')),
    });
  } catch (error) {
    console.error('Environment test error:', error);
    return NextResponse.json(
      { error: 'Failed to test environment' },
      { status: 500 }
    );
  }
}
