#!/usr/bin/env node

// Comprehensive test of AI functionality
import { config } from 'dotenv';
config({ path: '.env.local' });

import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('=== Comprehensive AI Functionality Test ===');

// Test basic Google AI SDK functionality
async function testBasicAI() {
  console.log('\n1. Testing Basic Google AI SDK...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Respond with exactly "AI is working" and nothing else.');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Basic AI test successful:', text.trim());
    return true;
  } catch (error) {
    console.log('❌ Basic AI test failed:', error.message);
    return false;
  }
}

// Test structured data generation (simulating what our library does)
async function testStructuredGeneration() {
  console.log('\n2. Testing Structured Data Generation...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      }
    });
    
    const prompt = `Generate a brief economic analysis for the United States. 
    
    Please respond with a valid JSON object that matches this structure:
    {
      "summary": "string",
      "keyFindings": ["string"],
      "implications": "string",
      "recommendations": ["string"]
    }
    
    Return only the JSON object, no additional text or formatting.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON
    const cleanText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsedData = JSON.parse(cleanText);
    
    console.log('✅ Structured data generation successful:');
    console.log('  Summary:', parsedData.summary?.substring(0, 100) + '...');
    console.log('  Key findings count:', parsedData.keyFindings?.length);
    console.log('  Recommendations count:', parsedData.recommendations?.length);
    return true;
  } catch (error) {
    console.log('❌ Structured data generation failed:', error.message);
    return false;
  }
}

// Test podcast script generation (key functionality)
async function testPodcastGeneration() {
  console.log('\n3. Testing Podcast Script Generation...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      }
    });
    
    const prompt = `You are creating a podcast script. The host is Rita (use label "Speaker1"). The expert guest is Das (use label "Speaker2").
    
    A user has asked: "What is inflation and how does it affect the economy?"
    
    Create a brief conversational dialogue where Rita and Das discuss this topic.
    
    Please respond with a valid JSON object that matches this structure:
    {
      "podcastScript": [
        {
          "speaker": "Speaker1",
          "line": "string"
        },
        {
          "speaker": "Speaker2", 
          "line": "string"
        }
      ]
    }
    
    Return only the JSON object, no additional text or formatting.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON
    const cleanText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsedData = JSON.parse(cleanText);
    
    console.log('✅ Podcast generation successful:');
    console.log('  Script lines count:', parsedData.podcastScript?.length);
    console.log('  First line preview:', parsedData.podcastScript?.[0]?.line?.substring(0, 80) + '...');
    return true;
  } catch (error) {
    console.log('❌ Podcast generation failed:', error.message);
    return false;
  }
}

// Test streaming functionality
async function testStreaming() {
  console.log('\n4. Testing Streaming Response...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContentStream('Explain inflation in exactly 50 words.');
    
    let fullText = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
    }
    
    console.log('✅ Streaming test successful:');
    console.log('  Response length:', fullText.length);
    console.log('  Response preview:', fullText.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.log('❌ Streaming test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    basic: await testBasicAI(),
    structured: await testStructuredGeneration(),
    podcast: await testPodcastGeneration(),
    streaming: await testStreaming()
  };
  
  console.log('\n=== Test Summary ===');
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  console.log(`✅ Passed: ${passed}/${total} tests`);
  
  if (passed === total) {
    console.log('🎉 All AI functionality is working correctly!');
  } else {
    console.log('⚠️  Some AI functionality needs attention.');
  }
  
  return results;
}

runAllTests().catch(console.error);
