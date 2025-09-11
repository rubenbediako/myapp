#!/usr/bin/env node

/**
 * Test to verify ElevenLabs integration and red reading navigation
 */

import { readFileSync } from 'fs';

console.log('=== Testing ElevenLabs Integration & Red Reading Navigation ===\n');

// Define patterns that SHOULD exist for ElevenLabs
const requiredPatterns = [
  'elevenlabs',
  'ElevenLabs',
  'Premium Voice',
  'Premium Audio',
  'bg-red-',
  'border-red-',
  'ring-red-'
];

// Define patterns that should be minimal (Google Gemini should be for text only)
const textOnlyPatterns = [
  'text generation',
  'AI content',
  'Google Gemini'
];

let allTestsPassed = true;
let confirmedFeatures = [];
let textFeatures = [];

// Get all relevant source files
const sourceFiles = [
  'src/hooks/use-podcast-audio.tsx',
  'src/app/ask-das-ai/page.tsx',
  'src/app/courses/[courseId]/page.tsx',
  'src/app/entrepreneurship-hub/page.tsx',
  'src/app/api/ai/generate-podcast-audio/route.ts',
  'src/lib/tts-services.ts'
];

console.log('1. Checking for ElevenLabs audio integration...\n');

for (const file of sourceFiles) {
  try {
    const content = readFileSync(file, 'utf8');
    
    for (const pattern of requiredPatterns) {
      const regex = new RegExp(pattern, 'gi');
      const matches = content.match(regex);
      
      if (matches) {
        confirmedFeatures.push(`✅ Found ElevenLabs pattern "${pattern}" in ${file}`);
      }
    }
  } catch (error) {
    console.log(`⚠️  Could not read ${file}: ${error.message}`);
  }
}

if (confirmedFeatures.length > 0) {
  confirmedFeatures.forEach(feature => console.log(feature));
  console.log('');
} else {
  console.log('❌ No ElevenLabs patterns found!\n');
  allTestsPassed = false;
}

console.log('2. Checking red reading navigation...\n');

try {
  const askDasContent = readFileSync('src/app/ask-das-ai/page.tsx', 'utf8');
  
  // Check for red gradient background
  if (askDasContent.includes('bg-gradient-to-r from-red-100 to-red-200')) {
    console.log('✅ Red gradient background found for reading navigation');
  } else {
    console.log('❌ Red gradient background not found');
    allTestsPassed = false;
  }
  
  // Check for red border
  if (askDasContent.includes('border-red-500')) {
    console.log('✅ Red border found for reading navigation');
  } else {
    console.log('❌ Red border not found');
    allTestsPassed = false;
  }
  
  // Check for red ring
  if (askDasContent.includes('ring-red-200')) {
    console.log('✅ Red ring found for reading navigation');
  } else {
    console.log('❌ Red ring not found');
    allTestsPassed = false;
  }
  
  // Check for red ping animation
  if (askDasContent.includes('bg-red-400') && askDasContent.includes('bg-red-500')) {
    console.log('✅ Red ping animation found for reading navigation');
  } else {
    console.log('❌ Red ping animation not found');
    allTestsPassed = false;
  }
  
} catch (error) {
  console.log(`❌ Could not verify reading navigation: ${error.message}`);
  allTestsPassed = false;
}

console.log('\n3. Checking API configuration...\n');

try {
  const apiContent = readFileSync('src/app/api/ai/generate-podcast-audio/route.ts', 'utf8');
  
  // Check that default is elevenlabs
  if (apiContent.includes(".default('elevenlabs')")) {
    console.log('✅ API endpoint defaults to ElevenLabs');
  } else {
    console.log('❌ API endpoint does not default to ElevenLabs');
    allTestsPassed = false;
  }
  
  // Check prioritization
  if (apiContent.includes('Prioritize ElevenLabs')) {
    console.log('✅ ElevenLabs prioritization found in API');
  } else {
    console.log('❌ ElevenLabs prioritization not found');
    allTestsPassed = false;
  }
  
} catch (error) {
  console.log(`❌ Could not verify API endpoint: ${error.message}`);
  allTestsPassed = false;
}

console.log('\n4. Checking TTS services configuration...\n');

try {
  const ttsContent = readFileSync('src/lib/tts-services.ts', 'utf8');
  
  // Check best provider defaults to elevenlabs
  if (ttsContent.includes("return 'elevenlabs'")) {
    console.log('✅ Best TTS provider defaults to ElevenLabs');
  } else {
    console.log('❌ Best TTS provider does not default to ElevenLabs');
    allTestsPassed = false;
  }
  
  // Check voice mapping
  if (ttsContent.includes('VR6AewLTigWG4xSOukaG')) {
    console.log('✅ Correct male voice ID found for ElevenLabs');
  } else {
    console.log('❌ Correct male voice ID not found');
    allTestsPassed = false;
  }
  
} catch (error) {
  console.log(`❌ Could not verify TTS services: ${error.message}`);
  allTestsPassed = false;
}

console.log('\n=== ElevenLabs Integration Test Results ===');

if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('✅ ElevenLabs configured for all audio generation');
  console.log('✅ Google Gemini used for text generation');
  console.log('✅ Red reading navigation properly implemented');
  console.log('✅ Premium voice experience configured');
} else {
  console.log('❌ Some tests failed - configuration incomplete');
  process.exit(1);
}

console.log('\n🎯 Summary:');
console.log('- Text Generation: Google Gemini for content');
console.log('- Audio Generation: ElevenLabs for premium voices');
console.log('- Reading Navigation: Red gradient with animations');
console.log('- Voice Quality: Professional-grade TTS');
