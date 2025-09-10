#!/usr/bin/env node

// Test script to verify Google AI API key and SDK integration
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');

async function testGoogleAI() {
  console.log('Testing Google AI SDK integration...');
  
  // Check environment variables
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log('API Key present:', !!apiKey);
  console.log('API Key prefix:', apiKey ? apiKey.substring(0, 10) + '...' : 'None');
  
  if (!apiKey) {
    console.error('ERROR: GOOGLE_GENERATIVE_AI_API_KEY not found in environment');
    process.exit(1);
  }
  
  try {
    console.log('Creating Google AI model...');
    const model = google('gemini-1.5-flash');
    console.log('Model created successfully');
    
    console.log('Making API call...');
    const result = await generateText({
      model,
      prompt: 'Say "Hello World" in exactly those words.',
      temperature: 0.1,
    });
    
    console.log('SUCCESS: AI responded with:', result.text);
    return true;
  } catch (error) {
    console.error('ERROR: AI test failed');
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testGoogleAI()
  .then(success => {
    console.log('\n--- Test Result ---');
    console.log(success ? 'PASS: Google AI SDK is working correctly' : 'FAIL: Google AI SDK test failed');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('FATAL ERROR:', error);
    process.exit(1);
  });
