#!/usr/bin/env node

// Test Google AI SDK directly
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

console.log('=== Testing Google AI SDK Direct ===');
console.log('API Key exists:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);

async function testGoogleAI() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Say hello in one word.');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Google AI SDK test successful!');
    console.log('Response:', text);
    
  } catch (error) {
    console.log('❌ Google AI SDK test failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

testGoogleAI().catch(console.error);
