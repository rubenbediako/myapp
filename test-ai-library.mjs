#!/usr/bin/env node

// Test our updated AI library
import { config } from 'dotenv';
config({ path: '.env.local' });

import { generateAIText, analyzeMacroeconomics } from './src/lib/ai.ts';

console.log('=== Testing Updated AI Library ===');

async function testAILibrary() {
  try {
    console.log('Testing generateAIText...');
    const textResult = await generateAIText('Say hello in one word', 'economicAnalysis');
    console.log('✅ generateAIText successful:', textResult);
    
    console.log('\nTesting analyzeMacroeconomics...');
    const macroResult = await analyzeMacroeconomics('United States', ['GDP Growth', 'Inflation']);
    console.log('✅ analyzeMacroeconomics successful:', JSON.stringify(macroResult, null, 2));
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

testAILibrary().catch(console.error);
