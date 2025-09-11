#!/usr/bin/env node

/**
 * Simplified Test - Check if key pages are accessible
 */

import http from 'http';

const BASE_URL = 'http://localhost:9002';

const testPages = [
  '/',
  '/dashboard',
  '/personal-finance',
  '/investment',
  '/savings',
  '/ask-das-ai',
  '/entrepreneurship-hub',
  '/courses',
  '/consumption',
  '/wages',
  '/employment-unemployment',
  '/budget',
  '/capital-market'
];

async function testPage(path) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    const req = http.get(url, (res) => {
      const status = res.statusCode;
      res.on('data', () => {}); // consume data
      res.on('end', () => {
        resolve({ path, status: status === 200 ? 'OK' : `Error ${status}` });
      });
    });
    
    req.on('error', (err) => {
      resolve({ path, status: `Error: ${err.message}` });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ path, status: 'Timeout' });
    });
  });
}

async function runTests() {
  console.log('🚀 Testing key pages...\n');
  
  const results = [];
  for (const path of testPages) {
    const result = await testPage(path);
    results.push(result);
    const status = result.status === 'OK' ? '✅' : '❌';
    console.log(`${status} ${path} - ${result.status}`);
  }
  
  const successful = results.filter(r => r.status === 'OK').length;
  console.log(`\n📊 Results: ${successful}/${results.length} pages working`);
  
  if (successful === results.length) {
    console.log('🎉 All pages are accessible!');
  } else {
    console.log('⚠️ Some pages need attention.');
  }
}

runTests().catch(console.error);
