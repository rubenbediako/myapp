import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const AudioStreamRequestSchema = z.object({
  base64Audio: z.string(),
  format: z.enum(['mp3', 'wav']).optional().default('mp3')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base64Audio, format } = AudioStreamRequestSchema.parse(body);

    // Convert base64 back to binary
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    
    // Set appropriate headers for audio streaming
    const headers = new Headers({
      'Content-Type': format === 'mp3' ? 'audio/mpeg' : 'audio/wav',
      'Content-Length': audioBuffer.length.toString(),
      'Cache-Control': 'public, max-age=3600',
    });

    return new NextResponse(audioBuffer, {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('Error streaming audio:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to stream audio', details: errorMessage },
      { status: 500 }
    );
  }
}
