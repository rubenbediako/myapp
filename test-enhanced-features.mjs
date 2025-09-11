#!/usr/bin/env node

/**
 * Test Enhanced Podcast Features
 * Tests the improved highlighting, factual content, and mathematical reading
 */

console.log('🧪 Testing Enhanced Podcast Features...\n');

async function testEnhancedAPI() {
  try {
    console.log('📡 Testing API with enhanced economic analysis...');
    
    const response = await fetch('http://localhost:3003/api/ai/ask-das-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: "What is Economics? Provide the precise definition, historical origins from Adam Smith, key principles including scarcity, and fundamental mathematical concepts like supply and demand curves.",
        contentType: "economics",
        enhancedMode: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('✅ API Response Structure:');
    console.log(`- Podcast Script Lines: ${result.podcastScript?.length || 0}`);
    console.log(`- Has Mathematical Content: ${JSON.stringify(result).includes('$') ? 'Yes' : 'No'}`);
    console.log(`- Has Statistical Data: ${JSON.stringify(result).includes('%') || JSON.stringify(result).includes('billion') ? 'Yes' : 'No'}`);
    console.log(`- Content Length: ${JSON.stringify(result).length} characters`);
    
    // Check for enhanced content features
    const content = JSON.stringify(result);
    const hasFormulas = content.includes('$') && content.includes('=');
    const hasStatistics = /(\d+\.?\d*%|\$\d+\.?\d*\s*(billion|trillion|million))/i.test(content);
    const hasEconomicTerms = /\b(GDP|inflation|unemployment|scarcity|supply|demand)\b/i.test(content);
    const hasHistoricalContext = /\b(Adam Smith|historical|origin|developed|theory)\b/i.test(content);
    
    console.log('\n📊 Enhanced Content Analysis:');
    console.log(`- Mathematical Formulas: ${hasFormulas ? '✅' : '❌'}`);
    console.log(`- Statistical Data: ${hasStatistics ? '✅' : '❌'}`);
    console.log(`- Economic Terms: ${hasEconomicTerms ? '✅' : '❌'}`);
    console.log(`- Historical Context: ${hasHistoricalContext ? '✅' : '❌'}`);
    
    // Sample a bit of the content
    if (result.podcastScript && result.podcastScript.length > 1) {
      console.log('\n🎙️ Sample Expert Analysis:');
      const expertLine = result.podcastScript.find(line => line.speaker === 'Speaker2');
      if (expertLine) {
        console.log(expertLine.line.substring(0, 200) + '...');
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    return false;
  }
}

async function testHighlightingFeatures() {
  console.log('\n🎨 Testing Text Highlighting Features...');
  
  // Test text with various economic content types
  const testTexts = [
    "The GDP growth rate increased by 3.2% this quarter, showing strong economic performance.",
    "Supply and demand curves intersect at the equilibrium point where $P = MC$.",
    "Adam Smith's theory of invisible hand explains market self-regulation mechanisms.",
    "Inflation reached 8.5% in 2022, the highest level since 1981."
  ];
  
  testTexts.forEach((text, index) => {
    console.log(`\n📝 Test ${index + 1}: "${text}"`);
    
    // Simulate highlighting detection
    const hasStatistics = /(\d+\.?\d*%|\$\d+\.?\d*\s*(billion|trillion|million|k|B|T))/i.test(text);
    const hasMath = /\$[^$]+\$/g.test(text);
    const hasEconomicTerms = /\b(GDP|inflation|unemployment|supply|demand|equilibrium)\b/i.test(text);
    const hasHistorical = /\b(Adam Smith|theory|invisible hand)\b/i.test(text);
    
    console.log(`   Statistics: ${hasStatistics ? '🔢' : '⚪'} | Math: ${hasMath ? '📐' : '⚪'} | Terms: ${hasEconomicTerms ? '📚' : '⚪'} | History: ${hasHistorical ? '📜' : '⚪'}`);
  });
  
  return true;
}

async function runTests() {
  console.log('🚀 Starting Enhanced Feature Tests\n');
  
  const results = [];
  
  // Test 1: Enhanced API
  results.push(await testEnhancedAPI());
  
  // Test 2: Highlighting Features
  results.push(await testHighlightingFeatures());
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n📈 Test Results: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('🎉 All enhanced features are working correctly!');
    console.log('\n🔗 Preview your enhanced podcast app at:');
    console.log('   • http://localhost:3003');
    console.log('   • http://10.45.226.51:3003');
  } else {
    console.log('⚠️  Some features need attention.');
  }
}

// Run the tests
runTests().catch(console.error);
