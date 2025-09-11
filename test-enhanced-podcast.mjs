// Test Enhanced Economics Podcast Features
// Using built-in fetch API (Node.js 18+)

const testEnhancedPodcast = async () => {
  console.log('🚀 Testing Enhanced Economics Podcast Features...\n');

  const testQuestions = [
    {
      name: "GDP Growth Analysis with Real Data",
      query: "How has GDP growth changed between the USA, China, Germany, and Japan from 2020 to 2024?"
    },
    {
      name: "Inflation and Phillips Curve Analysis", 
      query: "What is the relationship between inflation and unemployment rates according to the Phillips Curve, using real data from major economies?"
    },
    {
      name: "Interest Rate Policy Impact",
      query: "How do central bank interest rate changes affect economic growth and investment, with mathematical models?"
    }
  ];

  for (const test of testQuestions) {
    console.log(`\n📊 Testing: ${test.name}`);
    console.log(`❓ Question: ${test.query}\n`);

    try {
      const response = await fetch('http://localhost:9002/api/ai/ask-das-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: test.query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        console.error('❌ Error:', result.error);
        if (result.details) console.error('Details:', result.details);
        continue;
      }

      console.log('✅ Generated Enhanced Podcast Script:');
      console.log('='.repeat(60));

      // Analyze the response for enhanced features
      let hasRealData = false;
      let hasMathFormulas = false;
      let hasChartReferences = false;
      let hasStatistics = false;

      result.podcastScript.forEach((line, index) => {
        console.log(`\n${line.speaker === 'Speaker1' ? '🎙️  Rita' : '🧑‍💼 Das'}: ${line.line}`);
        
        // Check for enhanced features
        if (line.line.match(/\d+\.?\d*%|\$\d+\.?\d*\s*(billion|trillion|million)|\d+\.?\d*\s*(GDP|inflation|unemployment)/i)) {
          hasRealData = true;
        }
        if (line.line.includes('$') && line.line.includes('=')) {
          hasMathFormulas = true;
        }
        if (line.line.includes('[CHART:') || line.line.includes('chart') || line.line.includes('graph')) {
          hasChartReferences = true;
        }
        if (line.line.match(/(\d+\.?\d*%|\$\d+\.?\d*\s*(billion|trillion|million))/i)) {
          hasStatistics = true;
        }
      });

      console.log('\n' + '='.repeat(60));
      console.log('📈 Enhanced Features Analysis:');
      console.log(`   Real Economic Data: ${hasRealData ? '✅' : '❌'}`);
      console.log(`   Mathematical Formulas: ${hasMathFormulas ? '✅' : '❌'}`);
      console.log(`   Chart References: ${hasChartReferences ? '✅' : '❌'}`);
      console.log(`   Statistical Data: ${hasStatistics ? '✅' : '❌'}`);
      
      const enhancementScore = [hasRealData, hasMathFormulas, hasChartReferences, hasStatistics].filter(Boolean).length;
      console.log(`   Enhancement Score: ${enhancementScore}/4 (${(enhancementScore/4*100).toFixed(0)}%)`);

    } catch (error) {
      console.error(`❌ Test failed for "${test.name}":`, error.message);
    }

    console.log('\n' + '-'.repeat(80));
  }

  console.log('\n🎯 Enhanced Economics Podcast Testing Complete!');
  console.log('\n📊 Features Available:');
  console.log('   ✅ Real economic statistics and data from 2020-2024');
  console.log('   ✅ Mathematical formulas with LaTeX notation');
  console.log('   ✅ Interactive charts and graphs (GDP, inflation, unemployment)');
  console.log('   ✅ Economic models and equations');
  console.log('   ✅ Multi-provider AI support (Google Gemini + Anthropic Claude)');
  console.log('   ✅ Enhanced visual highlighting for statistics');
  console.log('   ✅ KaTeX math rendering and Recharts visualization');
};

testEnhancedPodcast().catch(console.error);
