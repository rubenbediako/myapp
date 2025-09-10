import { testGoogleAI } from '@/lib/test-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await testGoogleAI();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Test API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Test failed', details: errorMessage },
      { status: 500 }
    );
  }
}
