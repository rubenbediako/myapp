'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, Loader2, BarChart3, PieChart, Building2, Volume2 } from 'lucide-react';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland'
];

const marketTypes = [
  'Stock Market', 'Bond Market', 'Derivatives', 'Foreign Exchange', 
  'Commodities', 'Real Estate Investment Trusts', 'Private Equity', 
  'Venture Capital', 'Cryptocurrency', 'Money Market'
];

const analysisTypes = [
  'Market Structure', 'Liquidity Analysis', 'Volatility Assessment', 
  'Regulatory Environment', 'International Integration', 'Risk Metrics'
];

export default function CapitalMarketPage() {
  const [country, setCountry] = useState('');
  const [marketType, setMarketType] = useState('');
  const [analysisType, setAnalysisType] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

  const handleAnalyze = async () => {
    if (!country) return;
    
    setLoading(true);
    try {
      const query = `Analyze the capital market in ${country}${marketType ? ` focusing on ${marketType}` : ''}${analysisType ? ` with emphasis on ${analysisType}` : ''}. Include market size, key players, regulatory framework, performance metrics, and international comparisons.`;
        
      const response = await fetch('/api/ai/ask-das-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          mode: 'enhanced'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze capital market');
      }

      const result = await response.json();
      setAnalysis(result.response || 'Capital market analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing capital market:', error);
      setAnalysis('Failed to analyze capital market. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const podcastContent = `
    Capital Market Analysis - Understanding Financial Markets and Investment Infrastructure

    Introduction:
    Capital markets are the backbone of modern economies, facilitating the flow of capital from savers to borrowers and enabling economic growth through efficient resource allocation. This comprehensive analysis explores the structure, function, and dynamics of capital markets worldwide.

    Core Components of Capital Markets:

    1. Primary vs. Secondary Markets
    - Initial Public Offerings (IPOs) and new securities issuance
    - Secondary market trading and liquidity provision
    - Market makers and institutional investors
    - Price discovery mechanisms and efficiency
    - Settlement systems and clearing houses

    2. Equity Markets and Stock Exchanges
    - Stock exchange structures and governance
    - Market capitalization and index composition
    - Trading volumes and turnover ratios
    - Sectoral analysis and industry representation
    - Corporate governance and shareholder rights
    - Dividend policies and earnings yields

    3. Fixed Income and Bond Markets
    - Government bond markets and yield curves
    - Corporate bond issuance and credit ratings
    - Municipal and sub-sovereign debt
    - International bonds and Eurobond markets
    - Interest rate risk and duration analysis
    - Credit spreads and default probabilities

    4. Derivatives and Risk Management
    - Futures and forward contracts
    - Options markets and volatility trading
    - Swaps and over-the-counter derivatives
    - Hedging strategies and risk mitigation
    - Speculation vs. hedging functions
    - Systemic risk and counterparty exposure

    5. Foreign Exchange Markets
    - Currency trading and exchange rate determination
    - Central bank interventions and monetary policy
    - Purchasing power parity and real exchange rates
    - Currency risk management for corporations
    - International capital flows and balance of payments

    6. Alternative Investment Markets
    - Private equity and venture capital
    - Real estate investment trusts (REITs)
    - Commodity markets and natural resources
    - Hedge funds and alternative strategies
    - Cryptocurrency and digital assets
    - Infrastructure and project finance

    Market Structure and Regulation:

    1. Regulatory Frameworks
    - Securities and Exchange Commission oversight
    - Banking regulations and capital requirements
    - International regulatory coordination
    - Market conduct and investor protection
    - Systemic risk monitoring and macroprudential policy

    2. Market Microstructure
    - Order types and execution algorithms
    - High-frequency trading and market making
    - Bid-ask spreads and transaction costs
    - Market fragmentation and dark pools
    - Circuit breakers and volatility controls

    3. International Integration
    - Cross-border investment flows
    - Foreign portfolio investment trends
    - Capital account liberalization
    - Exchange rate regimes and capital controls
    - Regional market integration initiatives

    Performance Metrics and Analysis:

    1. Market Efficiency Indicators
    - Price volatility and return distributions
    - Correlation with economic fundamentals
    - Information processing speed
    - Arbitrage opportunities and market anomalies

    2. Liquidity and Depth Measures
    - Trading volume and market turnover
    - Bid-ask spreads and market impact
    - Order book depth and resilience
    - Funding liquidity and margin requirements

    3. Risk Assessment
    - Value at Risk (VaR) calculations
    - Stress testing and scenario analysis
    - Correlation breakdowns during crises
    - Systemic risk indicators and early warning systems
  `;

  const podcastOptions = [
    {
      title: 'Market Structure Fundamentals',
      description: 'Understanding how capital markets are organized and function',
      query: 'Explain capital market structure including primary vs secondary markets, market makers, and trading mechanisms with specific examples'
    },
    {
      title: 'Equity Market Analysis',
      description: 'Deep dive into stock markets, valuations, and equity trading',
      query: 'Analyze equity markets including stock valuation methods, market indices, and trading strategies with mathematical models'
    },
    {
      title: 'Fixed Income Markets',
      description: 'Bond markets, yield curves, and interest rate analysis',
      query: 'Examine fixed income markets including bond pricing, yield curve analysis, and interest rate risk management'
    },
    {
      title: 'Derivatives and Risk Management',
      description: 'Options, futures, and financial risk management tools',
      query: 'Explain derivatives markets including options pricing models, futures contracts, and hedging strategies with calculations'
    },
    {
      title: 'Market Regulation and Governance',
      description: 'Regulatory frameworks and market oversight mechanisms',
      query: 'Analyze capital market regulation including securities law, market supervision, and investor protection measures'
    },
    {
      title: 'Global Market Integration',
      description: 'International capital flows and cross-border investments',
      query: 'Examine global capital market integration including cross-border flows, foreign investment, and international financial stability'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Capital Market Analysis</h1>
          <p className="text-xl text-gray-600">AI-powered analysis of financial markets and investment infrastructure</p>
        </div>

        <Tabs defaultValue="podcast" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="podcast">
              <Volume2 className="mr-2 h-4 w-4" />
              Podcast Analysis
            </TabsTrigger>
            <TabsTrigger value="interactive">
              <BarChart3 className="mr-2 h-4 w-4" />
              Interactive Analysis
            </TabsTrigger>
            <TabsTrigger value="topics">
              <Building2 className="mr-2 h-4 w-4" />
              Market Topics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="podcast">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Capital Market Analysis Podcast
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of financial markets, trading systems, and investment infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UniversalPodcastPlayer 
                  title="Capital Market Analysis"
                  content={podcastContent}
                  options={{
                    contentType: 'economics',
                    title: 'Capital Market Analysis',
                    description: 'Comprehensive analysis of financial markets and investment infrastructure',
                    includeMath: true,
                    includeCharts: true,
                    includeStatistics: true
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interactive">
            <Card>
              <CardHeader>
                <CardTitle>Custom Capital Market Analysis</CardTitle>
                <CardDescription>Get AI-powered analysis for specific markets and countries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Select Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="marketType">Market Type (Optional)</Label>
                    <Select value={marketType} onValueChange={setMarketType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose market type" />
                      </SelectTrigger>
                      <SelectContent>
                        {marketTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="analysisType">Analysis Focus (Optional)</Label>
                    <Select value={analysisType} onValueChange={setAnalysisType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose analysis type" />
                      </SelectTrigger>
                      <SelectContent>
                        {analysisTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleAnalyze} 
                  disabled={!country || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Capital Market...
                    </>
                  ) : (
                    'Generate Market Analysis'
                  )}
                </Button>

                {analysis && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Capital Market Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics">
            <div className="grid gap-6 md:grid-cols-2">
              {podcastOptions.map((option, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // This could trigger the podcast player with the specific topic
                        console.log('Selected topic:', option.query);
                      }}
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      Listen to Analysis
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
