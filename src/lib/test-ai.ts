import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple test to check if the API works
export async function testGoogleAI() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Say hello in one word.');
    const response = await result.response;
    const text = response.text();
    
    console.log('AI Test successful:', text);
    return { success: true, result: text };
  } catch (error) {
    console.error('AI Test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}
