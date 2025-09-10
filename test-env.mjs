#!/usr/bin/env node

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });

console.log('=== Environment Check ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GOOGLE_GENERATIVE_AI_API_KEY exists:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
console.log('GOOGLE_GENAI_API_KEY exists:', !!process.env.GOOGLE_GENAI_API_KEY);

if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log('API Key length:', key.length);
  console.log('API Key prefix:', key.substring(0, 15) + '...');
  console.log('Starts with AIza:', key.startsWith('AIza'));
}

async function testDirectAPI() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key found');
    return;
  }
  
  try {
    console.log('\n=== Testing Direct Google API ===');
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
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('✅ Direct API test successful!');
      console.log('Response:', text);
    } else {
      const errorData = await response.json();
      console.log('❌ Direct API test failed:');
      console.log('Error:', JSON.stringify(errorData, null, 2));
    }
  } catch (error) {
    console.log('❌ Direct API test error:', error.message);
  }
}

async function testDirectGoogleAI() {
  try {
    console.log('\n=== Testing Direct Google AI SDK ===');
    
    // Use dynamic import for ES modules
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Say hello in one word.');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Direct Google AI SDK test successful!');
    console.log('Response:', text);
    
  } catch (error) {
    console.log('❌ Direct Google AI SDK test failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

async function main() {
  await testDirectAPI();
  await testDirectGoogleAI();
}

main().catch(console.error);
