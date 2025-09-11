#!/usr/bin/env node

/**
 * Debug the exact error happening in the ask-das-ai endpoint
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testAskDasAiEndpoint() {
  console.log('🐛 Debugging ask-das-ai endpoint...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/ai/ask-das-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'What is inflation?'
      })
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    
    const text = await response.text();
    console.log('📊 Response Body:', text);
    
    if (response.ok) {
      try {
        const json = JSON.parse(text);
        console.log('✅ JSON Parsing successful');
        console.log('📊 Podcast lines:', json.podcastScript?.length || 0);
      } catch (parseError) {
        console.log('❌ JSON Parse Error:', parseError.message);
      }
    } else {
      console.log('❌ API Request failed');
      try {
        const errorData = JSON.parse(text);
        console.log('📊 Error Details:', errorData);
      } catch (e) {
        console.log('📊 Raw Error:', text);
      }
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

// Run the test
testAskDasAiEndpoint().catch(console.error);
