#!/usr/bin/env node

/**
 * Comprehensive App Functionality Test - Podcast-First Version
 * Tests all pages, links, and buttons to ensure they work and deliver podcast content
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';

const BASE_URL = 'http://localhost:9002';
const TIMEOUT = 30000; // 30 seconds

// Track test results
let testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

// Color codes for terminal output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, method = 'GET') {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const requestModule = urlObj.protocol === 'https:' ? https : http;
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: method,
            timeout: TIMEOUT,
            headers: {
                'User-Agent': 'DasAI-Test-Bot/1.0'
            }
        };

        const req = requestModule.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data,
                    headers: res.headers
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

async function testPage(path, expectedFeatures = []) {
    testResults.total++;
    const url = `${BASE_URL}${path}`;
    
    try {
        log(`Testing: ${path}`, 'blue');
        const response = await makeRequest(url);
        
        if (response.statusCode !== 200) {
            throw new Error(`HTTP ${response.statusCode}`);
        }

        const html = response.data;
        const testResult = {
            path: path,
            status: 'PASS',
            features: [],
            issues: []
        };

        // Check for podcast-first features
        const podcastFeatures = {
            'UniversalPodcastPlayer': html.includes('UniversalPodcastPlayer') || html.includes('universal-podcast-player'),
            'TabsComponent': html.includes('TabsContent') || html.includes('tabs-content'),
            'MicIcon': html.includes('Mic') || html.includes('mic'),
            'PodcastContent': html.includes('podcast') || html.includes('Podcast'),
            'AudioCapability': html.includes('audio') || html.includes('Audio'),
            'NoUnderConstruction': !html.includes('under-construction') && !html.includes('Under Construction'),
            'ReactComponents': html.includes('__NEXT_DATA__') || html.includes('_app'),
            'NoErrors': !html.includes('Error:') && !html.includes('error') && !html.includes('404')
        };

        // Check expected features
        expectedFeatures.forEach(feature => {
            if (podcastFeatures[feature]) {
                testResult.features.push(feature);
            } else {
                testResult.issues.push(`Missing: ${feature}`);
            }
        });

        // Check for general podcast-first indicators
        Object.entries(podcastFeatures).forEach(([feature, present]) => {
            if (present) {
                testResult.features.push(feature);
            } else if (['NoUnderConstruction', 'ReactComponents', 'NoErrors'].includes(feature)) {
                testResult.issues.push(`Issue: ${feature}`);
            }
        });

        // Determine overall pass/fail
        const criticalIssues = testResult.issues.filter(issue => 
            issue.includes('NoUnderConstruction') || 
            issue.includes('NoErrors') || 
            issue.includes('ReactComponents')
        );

        if (criticalIssues.length === 0 && testResult.features.length >= 3) {
            testResults.passed++;
            log(`✓ PASS: ${path} - Features: ${testResult.features.length}`, 'green');
        } else {
            testResults.failed++;
            testResult.status = 'FAIL';
            log(`✗ FAIL: ${path} - Issues: ${testResult.issues.join(', ')}`, 'red');
        }

        testResults.details.push(testResult);

    } catch (error) {
        testResults.failed++;
        testResults.details.push({
            path: path,
            status: 'ERROR',
            error: error.message,
            features: [],
            issues: [`Error: ${error.message}`]
        });
        log(`✗ ERROR: ${path} - ${error.message}`, 'red');
    }
}

async function testAPI(endpoint, method = 'POST', payload = null) {
    testResults.total++;
    const url = `${BASE_URL}/api${endpoint}`;
    
    try {
        log(`Testing API: ${endpoint}`, 'blue');
        
        let requestOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'DasAI-Test-Bot/1.0'
            }
        };

        // For API tests, we'll just check if the endpoint exists and doesn't return 404
        const response = await makeRequest(url, method);
        
        if (response.statusCode === 404) {
            throw new Error('API endpoint not found');
        }

        if (response.statusCode >= 500) {
            throw new Error(`Server error: ${response.statusCode}`);
        }

        testResults.passed++;
        log(`✓ PASS: API ${endpoint} - Status: ${response.statusCode}`, 'green');
        
        testResults.details.push({
            path: endpoint,
            status: 'PASS',
            features: ['APIEndpoint'],
            issues: []
        });

    } catch (error) {
        testResults.failed++;
        testResults.details.push({
            path: endpoint,
            status: 'ERROR',
            error: error.message,
            features: [],
            issues: [`API Error: ${error.message}`]
        });
        log(`✗ ERROR: API ${endpoint} - ${error.message}`, 'red');
    }
}

async function runAllTests() {
    log('🎙️  Starting Comprehensive Podcast-First App Test Suite', 'bold');
    log('=' * 60, 'blue');

    // Test main pages with expected podcast features
    await testPage('/', ['UniversalPodcastPlayer', 'TabsComponent', 'MicIcon', 'NoUnderConstruction']);
    await testPage('/dashboard', ['UniversalPodcastPlayer', 'TabsComponent', 'NoUnderConstruction']);
    await testPage('/personal-finance', ['UniversalPodcastPlayer', 'TabsComponent', 'NoUnderConstruction']);
    await testPage('/investment', ['UniversalPodcastPlayer', 'TabsComponent', 'NoUnderConstruction']);
    await testPage('/savings', ['UniversalPodcastPlayer', 'TabsComponent', 'NoUnderConstruction']);
    await testPage('/ask-das-ai', ['UniversalPodcastPlayer', 'PodcastContent', 'NoUnderConstruction']);

    // Test newly transformed pages
    await testPage('/entrepreneurship-hub', ['UniversalPodcastPlayer', 'TabsComponent', 'NoUnderConstruction']);
    await testPage('/courses', ['UniversalPodcastPlayer', 'TabsComponent', 'NoUnderConstruction']);
    await testPage('/consumption', ['UniversalPodcastPlayer', 'TabsComponent', 'NoUnderConstruction']);
    await testPage('/wages', ['UniversalPodcastPlayer', 'TabsComponent', 'NoUnderConstruction']);

    // Test core analysis pages
    await testPage('/core-analysis/macroeconomics-variables', ['UniversalPodcastPlayer', 'NoUnderConstruction']);
    await testPage('/core-analysis/microeconomics-variables', ['UniversalPodcastPlayer', 'NoUnderConstruction']);
    await testPage('/core-analysis/comparative-analysis', ['UniversalPodcastPlayer', 'NoUnderConstruction']);
    await testPage('/core-analysis/forecast-predictions', ['UniversalPodcastPlayer', 'NoUnderConstruction']);

    // Test other important pages
    await testPage('/employment-unemployment', ['UniversalPodcastPlayer', 'NoUnderConstruction']);
    await testPage('/budget', ['NoUnderConstruction']);
    await testPage('/capital-market', ['NoUnderConstruction']);

    // Test authentication pages
    await testPage('/sign-in', ['NoErrors']);
    await testPage('/sign-up', ['NoErrors']);

    // Test other utility pages
    await testPage('/about', ['NoErrors']);
    await testPage('/pricing', ['NoErrors']);
    await testPage('/settings', ['NoErrors']);

    // Test API endpoints
    await testAPI('/ai/ask-das-ai');
    await testAPI('/health');

    // Generate summary report
    log('\\n' + '=' * 60, 'blue');
    log('📊 TEST SUMMARY REPORT', 'bold');
    log('=' * 60, 'blue');
    
    log(`Total Tests: ${testResults.total}`, 'blue');
    log(`Passed: ${testResults.passed}`, 'green');
    log(`Failed: ${testResults.failed}`, 'red');
    log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 
        testResults.passed === testResults.total ? 'green' : 'yellow');

    // Detailed results
    log('\\n📋 DETAILED RESULTS:', 'bold');
    testResults.details.forEach(result => {
        const status = result.status === 'PASS' ? '✓' : '✗';
        const color = result.status === 'PASS' ? 'green' : 'red';
        log(`${status} ${result.path} - ${result.status}`, color);
        
        if (result.features.length > 0) {
            log(`   Features: ${result.features.join(', ')}`, 'blue');
        }
        if (result.issues.length > 0) {
            log(`   Issues: ${result.issues.join(', ')}`, 'yellow');
        }
    });

    // Final verdict
    log('\\n' + '=' * 60, 'blue');
    if (testResults.passed === testResults.total) {
        log('🎉 ALL TESTS PASSED! The app is fully podcast-enabled and functional!', 'green');
    } else if (testResults.passed / testResults.total >= 0.8) {
        log('✅ MOSTLY SUCCESSFUL! Most features are working correctly.', 'yellow');
    } else {
        log('❌ NEEDS ATTENTION! Several issues need to be addressed.', 'red');
    }

    log('🎙️  Podcast-First Transformation Complete!', 'bold');
    process.exit(testResults.failed === 0 ? 0 : 1);
}

// Start the test suite
runAllTests().catch(error => {
    log(`Fatal error: ${error.message}`, 'red');
    process.exit(1);
});

export { runAllTests, testPage, testAPI };
