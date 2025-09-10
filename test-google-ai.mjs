import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

// Load environment variables (Next.js automatically loads .env.local)
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

console.log('=== Google AI SDK Test ===');
console.log('API Key present:', !!apiKey);
console.log('API Key prefix:', apiKey ? apiKey.substring(0, 10) + '...' : 'None');

if (!apiKey) {
  console.error('❌ GOOGLE_GENERATIVE_AI_API_KEY not found');
  process.exit(1);
}

async function testGoogleAI() {
  try {
    console.log('Creating Google provider...');
    const googleProvider = createGoogleGenerativeAI({
      apiKey: apiKey,
    });
    
    console.log('Creating model...');
    const model = googleProvider('gemini-1.5-flash');
    
    console.log('Making API call...');
    const result = await generateText({
      model,
      prompt: 'Respond with exactly "Hello World"',
      temperature: 0.1,
    });
    
    console.log('✅ SUCCESS! AI Response:', result.text);
    return { success: true, result: result.text };
  } catch (error) {
    console.error('❌ FAILED! Error:', error.message);
    return { success: false, error: error.message };
  }
}

export default testGoogleAI;
