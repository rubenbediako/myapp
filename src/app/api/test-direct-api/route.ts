import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key not found'
      });
    }
    
    // Direct test with Google's API
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say hello in one word.'
            }]
          }]
        })
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'Google API error',
        status: response.status,
        response: data
      });
    }
    
    return NextResponse.json({
      success: true,
      response: data,
      text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text response'
    });
    
  } catch (error) {
    console.error('Direct API test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}
