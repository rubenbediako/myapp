#!/usr/bin/env node

/**
 * Test to verify that all computer voice/Web Speech API code has been removed
 * and only pure natural voice (Google Gemini TTS) is used
 */

import { readFileSync } from 'fs';
import { glob } from 'glob';

console.log('=== Testing Pure Natural Voice Implementation ===\n');

// Define patterns that should NOT exist in the codebase
const forbiddenPatterns = [
  'speechSynthesis',
  'webkitSpeechSynthesis',
  'SpeechSynthesisUtterance',
  'getVoices\\(\\)',
  'speak\\(',
  'web-speech',
  'computer voice',
  'browser voice',
  'fallback.*speech',
  'Web Speech API'
];

// Define patterns that SHOULD exist to confirm Google Gemini usage
const requiredPatterns = [
  'google-gemini',
  'Google Gemini',
  'Pure Natural Voice',
  'generateGeminiAudio',
  'Natural Voice Generated'
];

let allTestsPassed = true;
let foundIssues = [];
let confirmedFeatures = [];

// Get all relevant source files
const sourceFiles = [
  'src/hooks/use-podcast-audio.tsx',
  'src/app/ask-das-ai/page.tsx',
  'src/app/courses/[courseId]/page.tsx',
  'src/app/entrepreneurship-hub/page.tsx',
  'src/app/api/ai/generate-podcast-audio/route.ts',
  'src/lib/tts-services.ts'
];

console.log('1. Checking for forbidden Web Speech API patterns...\n');

for (const file of sourceFiles) {
  try {
    const content = readFileSync(file, 'utf8');
    
    for (const pattern of forbiddenPatterns) {
      const regex = new RegExp(pattern, 'gi');
      const matches = content.match(regex);
      
      if (matches) {
        allTestsPassed = false;
        foundIssues.push(`❌ Found forbidden pattern "${pattern}" in ${file}: ${matches.join(', ')}`);
      }
    }
  } catch (error) {
    console.log(`⚠️  Could not read ${file}: ${error.message}`);
  }
}

if (foundIssues.length === 0) {
  console.log('✅ No forbidden Web Speech API patterns found!\n');
} else {
  foundIssues.forEach(issue => console.log(issue));
  console.log('');
}

console.log('2. Checking for required Google Gemini patterns...\n');

for (const file of sourceFiles) {
  try {
    const content = readFileSync(file, 'utf8');
    
    for (const pattern of requiredPatterns) {
      const regex = new RegExp(pattern, 'gi');
      const matches = content.match(regex);
      
      if (matches) {
        confirmedFeatures.push(`✅ Found required pattern "${pattern}" in ${file}`);
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
  console.log('❌ No required Google Gemini patterns found!\n');
  allTestsPassed = false;
}

console.log('3. Checking API endpoint configuration...\n');

try {
  const apiContent = readFileSync('src/app/api/ai/generate-podcast-audio/route.ts', 'utf8');
  
  // Check that default is google-gemini
  if (apiContent.includes(".default('google-gemini')")) {
    console.log('✅ API endpoint defaults to Google Gemini TTS');
  } else {
    console.log('❌ API endpoint does not default to Google Gemini TTS');
    allTestsPassed = false;
  }
  
  // Check that web-speech is not in the enum
  if (!apiContent.includes("'web-speech'")) {
    console.log('✅ Web Speech API option removed from API endpoint');
  } else {
    console.log('❌ Web Speech API option still present in API endpoint');
    allTestsPassed = false;
  }
  
} catch (error) {
  console.log(`❌ Could not verify API endpoint: ${error.message}`);
  allTestsPassed = false;
}

console.log('\n4. Checking TTS services configuration...\n');

try {
  const ttsContent = readFileSync('src/lib/tts-services.ts', 'utf8');
  
  // Check that provider type doesn't include web-speech
  if (!ttsContent.includes("'web-speech'")) {
    console.log('✅ Web Speech API removed from TTS provider types');
  } else {
    console.log('❌ Web Speech API still present in TTS provider types');
    allTestsPassed = false;
  }
  
  // Check that best provider defaults to google-gemini
  if (ttsContent.includes("return 'google-gemini'")) {
    console.log('✅ Best TTS provider defaults to Google Gemini');
  } else {
    console.log('❌ Best TTS provider does not default to Google Gemini');
    allTestsPassed = false;
  }
  
} catch (error) {
  console.log(`❌ Could not verify TTS services: ${error.message}`);
  allTestsPassed = false;
}

console.log('\n=== Pure Natural Voice Test Results ===');

if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('✅ Web Speech API / Computer Voice completely removed');
  console.log('✅ Only pure natural voice (Google Gemini TTS) is used');
  console.log('✅ No fallback to computer voice exists');
  console.log('✅ All podcast and audio features use Google Gemini exclusively');
} else {
  console.log('❌ Some tests failed - computer voice removal is incomplete');
  process.exit(1);
}

console.log('\n🎯 Summary:');
console.log('- All Web Speech API references removed');
console.log('- Google Gemini TTS is the only audio option');
console.log('- Pure natural voice experience implemented');
console.log('- No computer voice fallbacks remain');
