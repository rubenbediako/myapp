#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env.local') });

console.log('🧪 Testing Podcast Audio and Text Creation\n');

// Test 1: Environment Variables
console.log('1️⃣ Environment Variables Check:');
console.log('   GOOGLE_GENERATIVE_AI_API_KEY:', process.env.GOOGLE_GENERATIVE_AI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('   ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY ? '✅ Set' : '❌ Missing');
console.log('   ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing');

// Test 2: API Endpoint Accessibility
console.log('\n2️⃣ Testing API Endpoints:');

async function testApiEndpoint() {
  try {
    const response = await fetch('http://localhost:9002/api/ai/ask-das-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: 'What is inflation?',
        enhancedMode: true
      }),
    });

    if (response.ok) {
      console.log('   Ask Das-AI API: ✅ Accessible');
      const result = await response.json();
      console.log('   Podcast Script Generated:', result.podcastScript ? '✅ Yes' : '❌ No');
      
      if (result.podcastScript) {
        console.log('   Script Length:', result.podcastScript.length, 'lines');
      }
    } else {
      console.log('   Ask Das-AI API: ❌ Error', response.status);
    }
  } catch (error) {
    console.log('   Ask Das-AI API: ❌ Connection Error');
  }
}

async function testAudioEndpoint() {
  try {
    const testScript = [
      { speaker: "Speaker1", line: "Hello, welcome to our economics podcast" },
      { speaker: "Speaker2", line: "Thank you for having me on the show" }
    ];

    const response = await fetch('http://localhost:9002/api/ai/generate-podcast-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        podcastScript: testScript,
        query: 'economics basics',
        generatePremiumAudio: true
      }),
    });

    if (response.ok) {
      console.log('   Audio Generation API: ✅ Accessible');
      const result = await response.json();
      console.log('   Premium Audio Generated:', result.hasPremiumAudio ? '✅ Yes' : '❌ No');
      
      if (result.premiumAudio) {
        console.log('   Audio Provider:', result.premiumAudio.provider);
        console.log('   Audio Segments:', result.premiumAudio.totalSegments);
      }
    } else {
      console.log('   Audio Generation API: ❌ Error', response.status);
      const errorText = await response.text();
      console.log('   Error Details:', errorText);
    }
  } catch (error) {
    console.log('   Audio Generation API: ❌ Connection Error:', error.message);
  }
}

// Test 3: TTS Services Direct Test
console.log('\n3️⃣ Testing TTS Services Integration:');

async function testTTSServices() {
  try {
    // Test TTS services through API instead of direct import
    const response = await fetch('http://localhost:9002/api/ai/generate-podcast-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        podcastScript: [
          { speaker: "Speaker1", line: "Testing TTS functionality" },
          { speaker: "Speaker2", line: "This is a test of the text-to-speech system" }
        ],
        query: 'TTS test',
        generatePremiumAudio: true,
        ttsProvider: 'elevenlabs'
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('   TTS API Integration: ✅ Success');
      console.log('   Audio Provider Used:', result.premiumAudio?.provider || 'Unknown');
      console.log('   ElevenLabs Available:', result.premiumAudio?.provider === 'elevenlabs' ? '✅ Yes' : '❌ No');
      console.log('   Audio Quality:', result.premiumAudio?.quality || 'Standard');
      console.log('   Total Audio Segments:', result.premiumAudio?.totalSegments || 0);
      
      if (result.premiumAudio?.segments) {
        console.log('   Audio URLs Generated:', result.premiumAudio.segments.length > 0 ? '✅ Yes' : '❌ No');
      }
    } else {
      console.log('   TTS API Integration: ❌ Error', response.status);
    }
    
  } catch (error) {
    console.log('   TTS API Integration: ❌ Error:', error.message);
  }
}

// Run all tests
async function runTests() {
  await testApiEndpoint();
  await testAudioEndpoint();
  await testTTSServices();
  
  console.log('\n🎯 Test Complete!');
  console.log('\nIf any tests failed, the issues need to be addressed for proper podcast functionality.');
}

runTests().catch(console.error);
