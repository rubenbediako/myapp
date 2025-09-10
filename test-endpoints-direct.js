#!/usr/bin/env node

const https = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testEndpoints() {
  console.log('Testing AI endpoints...\n');

  // Test diagnostic endpoint
  console.log('1. Testing diagnostic endpoint:');
  try {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 9002,
      path: '/api/diagnostic',
      method: 'GET'
    });
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n2. Testing detailed AI endpoint:');
  try {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 9002,
      path: '/api/test-ai-detailed',
      method: 'GET'
    });
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n3. Testing ask-das-ai endpoint:');
  try {
    const postData = JSON.stringify({ query: 'What is inflation?' });
    const result = await makeRequest({
      hostname: 'localhost',
      port: 9002,
      path: '/api/ai/ask-das-ai',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\nTesting completed.');
}

testEndpoints();
