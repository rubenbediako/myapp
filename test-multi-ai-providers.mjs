#!/usr/bin/env node

/**
 * Test script for multiple AI text generation providers
 * Tests Google Gemini, Anthropic Claude, Mistral AI, and Cohere
 */

import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { Mistral } from '@mistralai/mistralai';
import pkg from 'cohere-ai';
const { CohereAPIClient } = pkg;

// Load environment variables
dotenv.config({ path: '.env.local' });

// Test prompt
const testPrompt = "Explain the concept of inflation in economics in exactly 2 sentences.";

console.log('🚀 Testing Multiple AI Text Generation Providers\n');
console.log(`Test Prompt: "${testPrompt}"\n`);

// Test Google Gemini
async function testGemini() {
  try {
    console.log('🔵 Testing Google Gemini...');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 200,
      }
    });
    
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini Response:');
    console.log(text);
    console.log('');
  } catch (error) {
    console.log('❌ Gemini Error:', error.message);
    console.log('');
  }
}

// Test Anthropic Claude
async function testClaude() {
  try {
    console.log('🟠 Testing Anthropic Claude...');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: testPrompt
        }
      ]
    });
    
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    console.log('✅ Claude Response:');
    console.log(text);
    console.log('');
  } catch (error) {
    console.log('❌ Claude Error:', error.message);
    console.log('');
  }
}

// Test Mistral AI
async function testMistral() {
  try {
    console.log('🟣 Testing Mistral AI...');
    const mistral = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY || '',
    });
    
    const response = await mistral.chat.complete({
      model: 'mistral-small-latest',
      temperature: 0.3,
      maxTokens: 200,
      messages: [
        {
          role: 'user',
          content: testPrompt
        }
      ]
    });
    
    const text = response.choices?.[0]?.message?.content || '';
    
    console.log('✅ Mistral Response:');
    console.log(text);
    console.log('');
  } catch (error) {
    console.log('❌ Mistral Error:', error.message);
    console.log('');
  }
}

// Test Cohere
async function testCohere() {
  try {
    console.log('🟡 Testing Cohere...');
    const cohere = new CohereAPIClient({
      token: process.env.COHERE_API_KEY || '',
    });
    
    const response = await cohere.chat({
      model: 'command-r',
      message: testPrompt,
      temperature: 0.3,
      maxTokens: 200,
    });
    
    const text = response.text || '';
    
    console.log('✅ Cohere Response:');
    console.log(text);
    console.log('');
  } catch (error) {
    console.log('❌ Cohere Error:', error.message);
    console.log('');
  }
}

// Run all tests
async function runAllTests() {
  const startTime = Date.now();
  
  // Test all providers in parallel for speed
  await Promise.allSettled([
    testGemini(),
    testClaude(),
    testMistral(),
    testCohere()
  ]);
  
  const endTime = Date.now();
  console.log(`\n🎯 All tests completed in ${(endTime - startTime) / 1000}s`);
  
  console.log('\n📋 Setup Instructions:');
  console.log('1. Get Google AI API key: https://aistudio.google.com/app/apikey');
  console.log('2. Get Anthropic API key: https://console.anthropic.com/');
  console.log('3. Get Mistral AI API key: https://console.mistral.ai/');
  console.log('4. Get Cohere API key: https://dashboard.cohere.ai/api-keys');
  console.log('5. Update your .env.local file with the API keys');
}

// Run the tests
runAllTests().catch(console.error);
