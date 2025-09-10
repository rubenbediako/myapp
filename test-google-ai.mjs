import { GoogleGenerativeAI } from '@google/generative-ai';

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
    console.log('Creating Google AI instance...');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log('Creating model...');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.1,
      }
    });
    
    console.log('Making API call...');
    const result = await model.generateContent('Respond with exactly "Hello World"');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! AI Response:', text);
    return { success: true, result: text };
  } catch (error) {
    console.error('❌ FAILED! Error:', error.message);
    return { success: false, error: error.message };
  }
}

export default testGoogleAI;
