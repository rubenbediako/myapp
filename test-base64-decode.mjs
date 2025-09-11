#!/usr/bin/env node

/**
 * Test base64 audio decoding functionality
 */

// Test the base64 decoding logic
function decodeBase64Audio(base64Data) {
  try {
    // Remove data URL prefix if present (e.g., "data:audio/mpeg;base64,")
    const base64String = base64Data.includes(',') 
      ? base64Data.split(',')[1] 
      : base64Data;
    
    // Clean the base64 string (remove any whitespace/newlines)
    const cleanBase64 = base64String.replace(/\s/g, '');
    
    // Validate base64 format
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
      throw new Error('Invalid base64 format');
    }
    
    // Decode base64 to binary
    const binaryString = atob(cleanBase64);
    return new Uint8Array(binaryString.split('').map(c => c.charCodeAt(0)));
  } catch (error) {
    console.error('Base64 decode error:', error);
    throw new Error(`Failed to decode base64 audio data: ${error.message}`);
  }
}

console.log('🧪 Testing base64 audio decoding...\n');

// Test cases
const testCases = [
  {
    name: 'Simple base64',
    data: 'SGVsbG8gV29ybGQ=', // "Hello World"
    shouldWork: true
  },
  {
    name: 'Data URL format',
    data: 'data:audio/mpeg;base64,SGVsbG8gV29ybGQ=',
    shouldWork: true
  },
  {
    name: 'Base64 with whitespace',
    data: 'SGVsbG8g\nV29ybGQ=',
    shouldWork: true
  },
  {
    name: 'Invalid base64',
    data: 'InvalidBase64!@#',
    shouldWork: false
  },
  {
    name: 'Empty string',
    data: '',
    shouldWork: false
  }
];

testCases.forEach((testCase, index) => {
  try {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    const result = decodeBase64Audio(testCase.data);
    
    if (testCase.shouldWork) {
      console.log(`✅ Success - Decoded ${result.length} bytes`);
    } else {
      console.log(`❌ Expected failure but got success`);
    }
  } catch (error) {
    if (!testCase.shouldWork) {
      console.log(`✅ Expected failure - ${error.message}`);
    } else {
      console.log(`❌ Unexpected failure - ${error.message}`);
    }
  }
  console.log('');
});

console.log('🎯 Base64 decoding test completed!');
