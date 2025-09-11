#!/usr/bin/env node

/**
 * Test the cleaned up AI providers (Gemini + Claude only)
 */

import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables
dotenv.config({ path: '.env.local' });

const testPrompt = 'Explain economic growth in one sentence.';

async function testCleanedProviders() {
  console.log('🧪 Testing cleaned AI providers (Gemini + Claude only)...\n');
  
  const results = {
    gemini: false,
    claude: false
  };
  
  // Test Google Gemini
  try {
    console.log('🧪 Testing Google Gemini...');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 100,
      }
    });
    
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Google Gemini Response:', text.substring(0, 80) + '...');
    results.gemini = true;
  } catch (error) {
    console.log('❌ Google Gemini Error:', error.message);
  }
  
  // Test Anthropic Claude
  try {
    console.log('🧪 Testing Anthropic Claude...');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
    
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 100,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: testPrompt
        }
      ]
    });
    
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log('✅ Anthropic Claude Response:', text.substring(0, 80) + '...');
    results.claude = true;
  } catch (error) {
    console.log('❌ Anthropic Claude Error:', error.message);
  }
  
  console.log('\n📊 Final Test Results:');
  console.log('========================');
  console.log(`✅ Google Gemini: ${results.gemini ? 'Working' : 'Failed'}`);
  console.log(`✅ Anthropic Claude: ${results.claude ? 'Working' : 'Failed'}`);
  console.log(`❌ Mistral AI: Removed`);
  console.log(`❌ Cohere: Removed`);
  
  const workingCount = Object.values(results).filter(Boolean).length;
  console.log(`\n🎯 ${workingCount}/2 providers working correctly`);
  
  if (workingCount === 2) {
    console.log('🎉 All remaining AI providers are functioning correctly!');
    console.log('🔧 Successfully cleaned up and streamlined to Gemini + Claude');
  } else {
    console.log('⚠️ Some providers need attention.');
  }
}

// Run the test
runAllTests().catch(console.error);

// Fix the function name
async function runAllTests() {
  await testCleanedProviders();
}
