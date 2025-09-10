import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Test the ask-das-ai endpoint
    const testResponse = await fetch('http://localhost:9002/api/ai/ask-das-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'What is inflation?'
      })
    });
    
    const result = await testResponse.json();
    
    return NextResponse.json({
      success: testResponse.ok,
      status: testResponse.status,
      result: result
    });
    
  } catch (error) {
    console.error('Test ask-das-ai error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to test the ask-das-ai endpoint',
    example: {
      method: 'POST',
      body: { query: 'What is inflation?' }
    }
  });
}
