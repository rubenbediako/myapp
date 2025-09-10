import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

// Simple test to check if the API works
export async function testGoogleAI() {
  try {
    const googleProvider = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
    const model = googleProvider('gemini-1.5-flash');
    
    const { text } = await generateText({
      model,
      prompt: 'Say hello in one word.',
    });
    console.log('AI Test successful:', text);
    return { success: true, result: text };
  } catch (error) {
    console.error('AI Test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}
