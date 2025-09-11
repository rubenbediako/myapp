#!/usr/bin/env node

/**
 * Test the exact API call that's failing
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testAPICall() {
  console.log('🧪 Testing the exact API call that is causing the server error...\n');
  
  const testQuery = "What is inflation?";
  
  try {
    const response = await fetch('http://localhost:3005/api/ai/ask-das-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: testQuery }),
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
      
      // Try to parse as JSON
      try {
        const errorData = JSON.parse(errorText);
        console.log('📄 Parsed Error:', errorData);
      } catch (parseError) {
        console.log('📝 Raw Error Text:', errorText);
      }
    } else {
      const result = await response.json();
      console.log('✅ Success! Generated podcast with', result.podcastScript?.length || 0, 'lines');
      console.log('📜 Sample line:', result.podcastScript?.[0]);
    }
    
  } catch (error) {
    console.log('❌ Network/Connection Error:', error.message);
    console.log('\n💡 Make sure the development server is running:');
    console.log('   npm run dev -- -p 3005');
  }
}

// Run the test
testAPICall().catch(console.error);
