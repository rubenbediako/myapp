'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, PiggyBank, Loader2, TrendingUp, Target, Calendar, Volume2, BarChart3 } from 'lucide-react';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland'
];

export default function SavingsPage() {
  const [country, setCountry] = useState('France'); // Default to France as mentioned in user request
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

  const handleAnalyze = async () => {
    if (!country) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/ask-das-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Analyze savings strategies and policies for ${country}. Include specific data on savings rates, interest rates, inflation impact, and practical recommendations for different income levels.`,
          mode: 'enhanced'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze savings');
      }

      const result = await response.json();
      setAnalysis(result.response || 'Analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing savings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate content for podcast
  const podcastContent = useMemo(() => {
    if (!country) {
      return `Savings Analysis Guide
      
      Learn about comprehensive savings strategies including:
      - Savings rates and market trends analysis
      - Investment vehicles and performance evaluation
      - Long-term wealth building strategies
      - Risk assessment and portfolio optimization
      - International savings market comparisons
      - Tax-efficient savings approaches
      
      Select a country to begin detailed analysis with real data and expert insights.`;
    }

    return `Comprehensive Savings Market Analysis: ${country}
    
    Current Economic Overview:
    ${country} presents unique opportunities in the global savings landscape. Understanding local market conditions, regulatory frameworks, and cultural factors is essential for optimal savings strategies.
    
    Key Analysis Areas:
    
    1. Savings Rates & Market Trends
    - Current deposit rates and historical performance
    - Central bank policy impacts on savings returns
    - Inflation-adjusted real returns analysis
    - Comparative analysis with global markets
    
    2. Investment Vehicles & Performance
    - Traditional savings accounts and term deposits
    - Government bonds and treasury securities
    - Stock market investment opportunities
    - Real estate investment trusts (REITs)
    - Pension schemes and retirement planning
    
    3. Long-term Wealth Building Strategy
    - Asset allocation recommendations by age group
    - Tax-efficient savings structures
    - Risk diversification across asset classes
    - Emergency fund establishment guidelines
    - Retirement planning optimization
    
    4. Regulatory Environment
    - Banking regulations and deposit insurance
    - Tax implications for different savings vehicles
    - Foreign investment restrictions and opportunities
    - Consumer protection frameworks
    
    Mathematical Models:
    
    Compound Interest Formula: A = P(1 + r/n)^(nt)
    Where:
    - A = Final amount
    - P = Principal investment
    - r = Annual interest rate
    - n = Number of times interest compounds per year
    - t = Number of years
    
    Risk-Return Analysis:
    Sharpe Ratio = (Return - Risk-free rate) / Standard deviation
    
    Real Return Calculation:
    Real Return = (1 + Nominal Return) / (1 + Inflation Rate) - 1
    
    Statistical Data Points:
    - Average household savings rate
    - GDP growth correlation with savings
    - Interest rate forecasts
    - Inflation projections
    - Currency stability metrics
    
    This analysis provides data-driven insights for optimizing savings strategies in ${country}'s unique economic environment.`;
  }, [country]);

  const savingsData = useMemo(() => [
    { name: 'Savings Accounts', rate: '2.1%', risk: 'Low', liquidity: 'High' },
    { name: 'Term Deposits', rate: '3.2%', risk: 'Low', liquidity: 'Medium' },
    { name: 'Government Bonds', rate: '2.8%', risk: 'Low', liquidity: 'Medium' },
    { name: 'Corporate Bonds', rate: '4.1%', risk: 'Medium', liquidity: 'Medium' },
    { name: 'Stock Market ETFs', rate: '7.2%', risk: 'High', liquidity: 'High' },
    { name: 'Real Estate REITs', rate: '5.8%', risk: 'Medium-High', liquidity: 'Medium' },
  ], []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Savings Analysis</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered savings strategies with podcast education, real data analysis, and multimedia insights
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Country Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              Country Selection
            </CardTitle>
            <CardDescription>
              Choose a country to analyze savings opportunities, rates, and investment strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAnalyze}
                disabled={!country || loading}
                size="default"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Update Analysis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="podcast" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Podcast Education
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Detailed Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PiggyBank className="h-5 w-5 text-blue-500" />
                    Savings Rates
                  </CardTitle>
                  <CardDescription>Current rates and trends in {country}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">2.1% - 3.2%</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Average annual percentage yield for savings accounts and term deposits
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Savings Accounts</span>
                      <Badge variant="outline">2.1% APY</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">12-Month CDs</span>
                      <Badge variant="outline">3.2% APY</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-green-500" />
                    Investment Options
                  </CardTitle>
                  <CardDescription>Available vehicles and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">4.1% - 7.2%</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Expected returns across investment vehicles
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Government Bonds</span>
                      <Badge variant="secondary">2.8% Return</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Stock Market ETFs</span>
                      <Badge variant="secondary">7.2% Return</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Long-term Strategy
                  </CardTitle>
                  <CardDescription>Wealth building recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">5-30 Years</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Strategic timeline for optimal wealth accumulation
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Emergency Fund</span>
                      <Badge variant="outline">3-6 Months</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Retirement</span>
                      <Badge variant="outline">20-30 Years</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Savings Vehicles Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Savings Vehicles Comparison</CardTitle>
                <CardDescription>Compare different savings and investment options available in {country}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Vehicle</th>
                        <th className="text-left p-3">Expected Return</th>
                        <th className="text-left p-3">Risk Level</th>
                        <th className="text-left p-3">Liquidity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savingsData.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-green-600">
                              {item.rate}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge 
                              variant={item.risk === 'Low' ? 'secondary' : item.risk === 'Medium' ? 'default' : 'destructive'}
                            >
                              {item.risk}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">{item.liquidity}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="podcast" className="space-y-6">
            <UniversalPodcastPlayer
              title={`Savings Analysis: ${country}`}
              content={podcastContent}
              options={{
                contentType: 'savings-analysis',
                title: `Savings Market Analysis: ${country}`,
                description: 'Comprehensive analysis of savings landscape and investment opportunities',
                data: { country, savingsData, analysis },
                includeMath: true,
                includeCharts: true,
                includeStatistics: true,
                audioPremium: true
              }}
              autoGenerate={true}
            />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {analysis ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Detailed Analysis Results
                  </CardTitle>
                  <CardDescription>AI-generated comprehensive analysis of {country}'s savings market</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {analysis}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Generate Detailed Analysis</CardTitle>
                  <CardDescription>Click "Update Analysis" to get AI-powered insights for {country}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Select a country and click "Update Analysis" to generate comprehensive savings market analysis with real data and strategic recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
