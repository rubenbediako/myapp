#!/usr/bin/env node

/**
 * Test OpenAI Integration
 * Tests that OpenAI API is working correctly with the new implementation
 */

import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testOpenAIIntegration() {
    console.log('🧪 Testing OpenAI Integration...\n');

    // Test 1: API Key validation
    console.log('� Test 1: API Key Validation');
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.startsWith('sk-proj-')) {
        console.log('✅ OpenAI API key is present and correctly formatted');
        console.log('� Key preview:', apiKey.substring(0, 20) + '...' + apiKey.substring(apiKey.length - 10) + '\n');
    } else {
        console.error('❌ OpenAI API key is missing or incorrectly formatted\n');
    }

    // Test 2: Direct OpenAI API test
    console.log('🌐 Test 2: Direct OpenAI API Test');
    try {
        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ 
                role: 'user', 
                content: 'Explain inflation in economics in one short sentence.' 
            }],
            max_tokens: 50,
        });

        const response = completion.choices[0]?.message?.content || '';
        console.log('✅ Direct OpenAI API call successful');
        console.log('� Response:', response + '\n');
    } catch (error) {
        console.error('❌ Direct OpenAI API call failed:', error.message + '\n');
    }

    console.log('🎯 OpenAI Integration Test Complete!');
}

// Run tests
testOpenAIIntegration().catch(console.error);
