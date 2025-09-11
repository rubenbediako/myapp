#!/usr/bin/env node

/**
 * Test the Anthropic Claude API integration and debug the server error
 */

import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testClaudeAPI() {
  console.log('🧪 Testing Anthropic Claude API for server error debugging...\n');
  
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
    
    console.log('🔑 API Key loaded:', process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No');
    
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: `Create a simple podcast script about inflation with exactly 3 exchanges. Return ONLY valid JSON format:
{
  "podcastScript": [
    {"speaker": "Host", "line": "Welcome to our economics podcast. Today we're discussing inflation."},
    {"speaker": "Expert", "line": "Thank you for having me. Inflation is a critical economic indicator."},
    {"speaker": "Host", "line": "Can you explain what causes inflation?"}
  ]
}

Return ONLY the JSON object, no other text or explanation.`
        }
      ]
    });
    
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log('✅ Claude Response received:');
    console.log(text.substring(0, 500) + '...');
    
    // Test JSON parsing
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('\n✅ JSON parsing successful');
        console.log('📊 Podcast script lines:', parsed.podcastScript?.length || 0);
      } else {
        console.log('❌ No JSON found in response');
      }
    } catch (parseError) {
      console.log('❌ JSON parsing failed:', parseError.message);
    }
    
  } catch (error) {
    console.log('❌ Claude API Error:', error.message);
    
    if (error.status) {
      console.log('📊 Status Code:', error.status);
    }
    
    if (error.message.includes('401')) {
      console.log('🔑 Issue: Invalid API key or authentication error');
    } else if (error.message.includes('403')) {
      console.log('🚫 Issue: API access forbidden - check billing/usage');
    } else if (error.message.includes('404')) {
      console.log('📍 Issue: Model not found - using deprecated model');
    } else if (error.message.includes('429')) {
      console.log('⏰ Issue: Rate limit exceeded');
    }
  }
}

// Run the test
testClaudeAPI().catch(console.error);
