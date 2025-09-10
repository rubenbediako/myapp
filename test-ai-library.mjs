#!/usr/bin/env node

// Test our updated AI library through API endpoints
import { config } from 'dotenv';
config({ path: '.env.local' });

console.log('=== Testing Updated AI Library via API ===');

async function testAPIEndpoints() {
  try {
    console.log('Testing /api/test-ai endpoint...');
    const response1 = await fetch('http://localhost:3000/api/test-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: 'Say hello in one word' })
    });
    
    if (response1.ok) {
      const result1 = await response1.json();
      console.log('✅ test-ai successful:', result1);
    } else {
      console.log('❌ test-ai failed:', response1.status, await response1.text());
    }
    
    console.log('\nTesting /api/ai/economic-analysis endpoint...');
    const response2 = await fetch('http://localhost:3000/api/ai/economic-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: 'Analyze the economic situation of the United States focusing on GDP and inflation' 
      })
    });
    
    if (response2.ok) {
      const result2 = await response2.json();
      console.log('✅ economic-analysis successful:', JSON.stringify(result2, null, 2));
    } else {
      console.log('❌ economic-analysis failed:', response2.status, await response2.text());
    }
    
  } catch (error) {
    console.error('❌ Error testing API endpoints:', error.message);
  }
}

// Run the test
testAPIEndpoints().catch(console.error);
