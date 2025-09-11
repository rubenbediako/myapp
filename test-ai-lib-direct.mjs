#!/usr/bin/env node

/**
 * Test the AI library directly to identify issues
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testAILibrary() {
  console.log('🧪 Testing AI library imports...\n');
  
  try {
    // Test the import
    const { generateStructuredData, PodcastScriptSchema } = await import('./src/lib/ai.ts');
    console.log('✅ AI library imported successfully');
    
    // Test a simple generation
    const prompt = 'Create a simple test podcast script about inflation with 2 exchanges.';
    
    console.log('🧪 Testing generateStructuredData...');
    const result = await generateStructuredData(prompt, PodcastScriptSchema);
    
    console.log('✅ Generation successful!');
    console.log('📊 Result type:', typeof result);
    console.log('📊 Podcast lines:', result?.podcastScript?.length || 0);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('📊 Stack:', error.stack);
  }
}

// Run the test
testAILibrary().catch(console.error);
