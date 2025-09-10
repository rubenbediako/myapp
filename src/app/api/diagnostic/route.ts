import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const googleGenaiKey = process.env.GOOGLE_GENAI_API_KEY;
    
    // Get all Google-related env vars
    const googleEnvVars = Object.keys(process.env)
      .filter(key => key.includes('GOOGLE'))
      .reduce((acc, key) => {
        acc[key] = process.env[key] ? `${process.env[key]?.substring(0, 10)}...` : 'undefined';
        return acc;
      }, {} as Record<string, string>);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasGoogleGenerativeAiApiKey: !!googleApiKey,
      hasGoogleGenaiApiKey: !!googleGenaiKey,
      googleApiKeyPrefix: googleApiKey ? `${googleApiKey.substring(0, 10)}...` : null,
      allGoogleEnvVars: googleEnvVars,
      nodeVersion: process.version,
    });
  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json(
      { 
        error: 'Diagnostic failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
