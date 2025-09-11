#!/usr/bin/env node

/**
 * Comprehensive test of all AI providers (Gemini, Claude, Mistral, Cohere)
 */

import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { Mistral } from '@mistralai/mistralai';
import { CohereClient } from 'cohere-ai';

// Load environment variables
dotenv.config({ path: '.env.local' });

const testPrompt = 'Explain inflation in one sentence.';

async function testGoogleGemini() {
  console.log('🧪 Testing Google Gemini...');
  try {
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
    
    console.log('✅ Google Gemini Response:', text.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.log('❌ Google Gemini Error:', error.message);
    return false;
  }
}

async function testAnthropic() {
  console.log('🧪 Testing Anthropic Claude...');
  try {
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
    console.log('✅ Anthropic Claude Response:', text.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.log('❌ Anthropic Claude Error:', error.message);
    return false;
  }
}

async function testMistral() {
  console.log('🧪 Testing Mistral AI...');
  try {
    const mistral = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY || '',
    });
    
    const response = await mistral.chat.complete({
      model: 'mistral-small-latest',
      temperature: 0.3,
      maxTokens: 100,
      messages: [
        {
          role: 'user',
          content: testPrompt
        }
      ]
    });
    
    const text = response.choices?.[0]?.message?.content || '';
    console.log('✅ Mistral AI Response:', text.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.log('❌ Mistral AI Error:', error.message);
    return false;
  }
}

async function testCohere() {
  console.log('🧪 Testing Cohere...');
  try {
    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY || '',
    });
    
    const response = await cohere.generate({
      model: 'r-plus',
      prompt: testPrompt,
      temperature: 0.3,
      maxTokens: 100,
    });
    
    const text = response.generations?.[0]?.text || '';
    console.log('✅ Cohere Response:', text.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.log('❌ Cohere Error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Testing all AI providers...\n');
  
  const results = {
    gemini: await testGoogleGemini(),
    claude: await testAnthropic(), 
    mistral: await testMistral(),
    cohere: await testCohere()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([provider, success]) => {
    console.log(`${success ? '✅' : '❌'} ${provider.charAt(0).toUpperCase() + provider.slice(1)}: ${success ? 'Working' : 'Failed'}`);
  });
  
  const successCount = Object.values(results).filter(Boolean).length;
  console.log(`\n🎯 ${successCount}/4 providers working correctly`);
  
  if (successCount === 4) {
    console.log('🎉 All AI providers are functioning correctly!');
  } else {
    console.log('⚠️ Some providers need attention. Check API keys and billing status.');
  }
}

// Run the tests
runAllTests().catch(console.error);
