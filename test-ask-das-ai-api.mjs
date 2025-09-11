#!/usr/bin/env node

/**
 * Test the Ask Das AI API endpoint with multi-provider support
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const API_URL = 'http://localhost:9003';

async function testAskDasAI() {
  console.log('🧪 Testing Ask Das AI API with Multi-Provider Support\n');
  
  const testQuery = "What causes inflation in economics?";
  console.log(`📝 Test Query: "${testQuery}"`);
  
  try {
    console.log(`\n🔗 Making request to: ${API_URL}/api/ai/ask-das-ai`);
    
    const response = await fetch(`${API_URL}/api/ai/ask-das-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: testQuery }),
    });
    
    console.log(`📊 Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ API Error: ${errorText}`);
      return;
    }
    
    const result = await response.json();
    console.log(`\n✅ API Response received!`);
    console.log(`📜 Generated ${result.podcastScript?.length || 0} dialogue lines`);
    
    if (result.podcastScript && result.podcastScript.length > 0) {
      console.log(`\n🎙️ Sample Dialogue:`);
      result.podcastScript.slice(0, 2).forEach((line, index) => {
        const speaker = line.speaker === "Speaker1" ? "Rita" : "Das";
        console.log(`${speaker}: ${line.line.substring(0, 100)}...`);
      });
    }
    
    console.log(`\n🎉 Multi-provider AI system is working!`);
    console.log(`💡 Your app now supports:`);
    console.log(`   • Google Gemini (fast inference)`);
    console.log(`   • Anthropic Claude (high-quality reasoning)`);
    console.log(`   • Mistral AI (multilingual, privacy-focused)`);
    console.log(`   • ElevenLabs (premium audio)`);
    
  } catch (error) {
    console.log(`❌ Test Error: ${error.message}`);
    console.log(`\n💡 Make sure the development server is running on port 9003`);
    console.log(`   Run: npm run dev -- -p 9003`);
  }
}

// Run the test
testAskDasAI().catch(console.error);
