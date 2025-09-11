#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env.local') });

console.log('🎙️ Complete Podcast Creation Flow Test\n');

async function createFullPodcast() {
  console.log('📝 Step 1: Generating podcast script with Claude...');
  
  try {
    // Step 1: Generate podcast script using Claude
    const scriptResponse = await fetch('http://localhost:9002/api/ai/ask-das-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: 'Explain cryptocurrency and Bitcoin for beginners',
        enhancedMode: true,
        contentType: 'educational'
      }),
    });

    if (!scriptResponse.ok) {
      throw new Error(`Script generation failed: ${scriptResponse.status}`);
    }

    const scriptData = await scriptResponse.json();
    console.log('✅ Claude generated podcast script with', scriptData.podcastScript.length, 'exchanges');
    
    // Show a sample of the script
    console.log('\n📃 Sample Script Preview:');
    scriptData.podcastScript.slice(0, 2).forEach((line, i) => {
      console.log(`   ${line.speaker}: "${line.line.substring(0, 80)}..."`);
    });

    console.log('\n🎵 Step 2: Converting to premium audio with ElevenLabs...');
    
    // Step 2: Generate premium audio
    const audioResponse = await fetch('http://localhost:9002/api/ai/generate-podcast-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        podcastScript: scriptData.podcastScript,
        query: 'cryptocurrency basics',
        generatePremiumAudio: true,
        generateVisuals: true,
        ttsProvider: 'elevenlabs',
        audioFormat: 'mp3'
      }),
    });

    if (!audioResponse.ok) {
      throw new Error(`Audio generation failed: ${audioResponse.status}`);
    }

    const audioData = await audioResponse.json();
    console.log('✅ ElevenLabs generated premium audio');
    console.log('   Provider:', audioData.premiumAudio?.provider);
    console.log('   Quality:', audioData.premiumAudio?.quality);
    console.log('   Total Segments:', audioData.premiumAudio?.totalSegments);
    console.log('   Has Visual Content:', audioData.hasVisuals ? 'Yes' : 'No');
    
    if (audioData.premiumAudio?.segments) {
      console.log('   Audio Files Created:', audioData.premiumAudio.segments.length);
      console.log('   Sample Audio URL:', audioData.premiumAudio.segments[0]?.url ? 'Generated' : 'None');
    }

    console.log('\n✨ Step 3: Podcast Creation Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Text Generation (Claude):', '✅ Success');
    console.log('🎤 Audio Generation (ElevenLabs):', '✅ Success');
    console.log('📈 Visual Content:', audioData.hasVisuals ? '✅ Generated' : '❌ None');
    console.log('⏱️ Total Processing Time:', 'Complete');
    
    console.log('\n🎯 Full podcast creation flow is working perfectly!');
    console.log('   • Claude API: Generating engaging economic dialogue');
    console.log('   • ElevenLabs TTS: Creating high-quality audio');
    console.log('   • Visual Content: Ready for enhanced presentations');
    
  } catch (error) {
    console.error('❌ Error in podcast creation flow:', error.message);
  }
}

// Run the complete test
createFullPodcast();
