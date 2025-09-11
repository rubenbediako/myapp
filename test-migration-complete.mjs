#!/usr/bin/env node

/**
 * Final validation test for the ElevenLabs + Google Gemini/OpenAI migration
 * This verifies that:
 * 1. Google Gemini/OpenAI is used for ALL text generation
 * 2. ElevenLabs is used for ALL audio generation
 * 3. Red reading navigation is properly implemented
 * 4. No fallbacks to Google Gemini TTS for audio remain
 */

import { readFileSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

console.log('🧪 === FINAL MIGRATION VALIDATION TEST ===\n');

let allTestsPassed = true;
const issues = [];
const successes = [];

// Test 1: Environment Variables
console.log('1️⃣  Testing environment variables...');
const requiredEnvVars = [
  'GOOGLE_GENERATIVE_AI_API_KEY',
  'ELEVENLABS_API_KEY'
];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    successes.push(`✅ ${envVar} is configured`);
  } else {
    issues.push(`❌ ${envVar} is missing`);
    allTestsPassed = false;
  }
});

// Test 2: ElevenLabs Integration
console.log('\n2️⃣  Testing ElevenLabs audio integration...');
const elevenlabsFiles = [
  'src/hooks/use-podcast-audio.tsx',
  'src/app/api/ai/generate-podcast-audio/route.ts',
  'src/lib/tts-services.ts'
];

elevenlabsFiles.forEach(file => {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf8');
    if (content.includes('elevenlabs') || content.includes('ElevenLabs')) {
      successes.push(`✅ ${file} contains ElevenLabs integration`);
    } else {
      issues.push(`❌ ${file} missing ElevenLabs integration`);
      allTestsPassed = false;
    }
  }
});

// Test 3: Google Gemini/OpenAI Text Generation
console.log('\n3️⃣  Testing Google Gemini/OpenAI text generation...');
const textGenerationFiles = [
  'src/lib/ai.ts',
  'src/app/api/ai/ask-das-ai/route.ts'
];

textGenerationFiles.forEach(file => {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf8');
    if (content.includes('GoogleGenerativeAI') || content.includes('OpenAI')) {
      successes.push(`✅ ${file} uses Google Gemini/OpenAI for text`);
    } else {
      issues.push(`❌ ${file} missing AI text integration`);
      allTestsPassed = false;
    }
  }
});

// Test 4: Red Reading Navigation
console.log('\n4️⃣  Testing red reading navigation...');
const navigationFiles = [
  'src/app/ask-das-ai/page.tsx',
  'src/app/courses/[courseId]/page.tsx'
];

navigationFiles.forEach(file => {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf8');
    const hasRedStyling = content.includes('bg-red-') || 
                         content.includes('border-red-') || 
                         content.includes('ring-red-');
    if (hasRedStyling) {
      successes.push(`✅ ${file} has red reading navigation`);
    } else {
      issues.push(`❌ ${file} missing red navigation styling`);
      allTestsPassed = false;
    }
  }
});

// Test 5: No Google Gemini TTS fallbacks
console.log('\n5️⃣  Checking for Google Gemini TTS fallbacks...');
const checkFiles = [
  'src/hooks/use-podcast-audio.tsx',
  'src/app/api/ai/generate-podcast-audio/route.ts'
];

checkFiles.forEach(file => {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf8');
    const badPatterns = [
      'google.*tts',
      'gemini.*audio',
      'gemini.*speech'
    ];
    
    let foundBadPattern = false;
    badPatterns.forEach(pattern => {
      const regex = new RegExp(pattern, 'gi');
      if (regex.test(content)) {
        issues.push(`⚠️  ${file} contains potential Gemini TTS reference: ${pattern}`);
        foundBadPattern = true;
      }
    });
    
    if (!foundBadPattern) {
      successes.push(`✅ ${file} properly separates text/audio generation`);
    }
  }
});

// Test 6: Default Configuration
console.log('\n6️⃣  Testing default provider configuration...');
const routeFile = 'src/app/api/ai/generate-podcast-audio/route.ts';
if (existsSync(routeFile)) {
  const content = readFileSync(routeFile, 'utf8');
  if (content.includes("default('elevenlabs')")) {
    successes.push(`✅ ${routeFile} defaults to ElevenLabs`);
  } else {
    issues.push(`❌ ${routeFile} doesn't default to ElevenLabs`);
    allTestsPassed = false;
  }
}

// Test 7: UI Labels and Messages
console.log('\n7️⃣  Testing UI labels and messages...');
const uiFiles = [
  'src/app/ask-das-ai/page.tsx',
  'src/app/courses/[courseId]/page.tsx',
  'src/app/entrepreneurship-hub/page.tsx'
];

uiFiles.forEach(file => {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf8');
    const hasElevenLabsUI = content.includes('ElevenLabs') || 
                           content.includes('Premium Voice') ||
                           content.includes('Premium Audio');
    if (hasElevenLabsUI) {
      successes.push(`✅ ${file} has updated UI labels for ElevenLabs`);
    } else {
      issues.push(`⚠️  ${file} might need UI label updates`);
    }
  }
});

// Results Summary
console.log('\n🎯 === TEST RESULTS ===\n');

console.log('✅ SUCCESSES:');
successes.forEach(success => console.log(`   ${success}`));

if (issues.length > 0) {
  console.log('\n⚠️  ISSUES FOUND:');
  issues.forEach(issue => console.log(`   ${issue}`));
}

console.log('\n📊 === MIGRATION STATUS ===');
if (allTestsPassed && issues.length === 0) {
  console.log('🎉 MIGRATION COMPLETE! ✅');
  console.log('');
  console.log('📋 Summary:');
  console.log('   📝 Text Generation: Google Gemini/OpenAI');
  console.log('   🎤 Audio Generation: ElevenLabs');
  console.log('   🔴 Reading Navigation: Red styling');
  console.log('   ⚙️  Default Configuration: ElevenLabs');
  console.log('   🖥️  UI Labels: Updated');
  console.log('');
  console.log('🚀 Your app is ready with the best AI + voice combination!');
} else {
  console.log('⚠️  MIGRATION NEEDS ATTENTION');
  console.log(`   Found ${issues.length} issue(s) that need to be addressed.`);
  allTestsPassed = false;
}

process.exit(allTestsPassed ? 0 : 1);
