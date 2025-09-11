'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, DollarSign, Loader2, TrendingUp, PieChart, BarChart3, Calculator, Volume2 } from 'lucide-react';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland'
];

const budgetCategories = [
  'Defense & Security', 'Healthcare', 'Education', 'Infrastructure', 
  'Social Services', 'Interest Payments', 'Research & Development', 
  'Environmental Protection', 'Law Enforcement', 'Economic Development'
];

export default function BudgetPage() {
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

  const handleAnalyze = async () => {
    if (!country) return;
    
    setLoading(true);
    try {
      const query = category 
        ? `Analyze ${category} budget allocation and spending for ${country}. Include historical trends, international comparisons, efficiency metrics, and policy recommendations.`
        : `Provide comprehensive government budget analysis for ${country}. Include revenue sources, expenditure breakdown, deficit/surplus analysis, debt levels, and fiscal policy implications.`;
        
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
        throw new Error('Failed to analyze budget');
      }

      const result = await response.json();
      setAnalysis(result.response || 'Budget analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing budget:', error);
      setAnalysis('Failed to analyze budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const podcastContent = `
    Government Budget Analysis - Understanding Public Finance and Fiscal Policy

    Introduction:
    Government budgets are the cornerstone of public finance, reflecting a nation's priorities, economic strategy, and social commitments. This comprehensive analysis explores how governments allocate resources, manage public finances, and implement fiscal policies to achieve economic and social objectives.

    Core Components of Government Budgets:

    1. Revenue Sources and Tax Policy
    - Income taxes and progressive taxation systems
    - Corporate taxes and business revenue contributions
    - Sales taxes, VAT, and consumption-based revenue
    - Import duties, tariffs, and trade-related income
    - Non-tax revenues from government enterprises and assets
    - Borrowing and debt financing mechanisms

    2. Expenditure Categories and Allocation
    - Mandatory vs. discretionary spending analysis
    - Defense and security budget allocations
    - Healthcare and social services investments
    - Education and human capital development
    - Infrastructure and public works projects
    - Interest payments on government debt
    - Transfer payments and social safety nets

    3. Budget Balance and Fiscal Health
    - Deficit financing and debt sustainability
    - Surplus management and fiscal reserves
    - Debt-to-GDP ratios and international comparisons
    - Credit ratings and borrowing costs
    - Intergenerational equity and future obligations

    4. Economic Impact and Multiplier Effects
    - Keynesian vs. classical fiscal policy approaches
    - Government spending multipliers by category
    - Tax policy effects on economic growth
    - Counter-cyclical fiscal policy during recessions
    - Supply-side economics and productivity investments

    5. International Comparisons and Best Practices
    - OECD spending patterns and benchmarks
    - Nordic model vs. Anglo-Saxon approaches
    - Emerging market fiscal challenges
    - European Union fiscal rules and convergence criteria
    - Federal vs. unitary budget structures

    6. Budget Process and Governance
    - Executive budget preparation and proposal
    - Legislative review and approval process
    - Independent fiscal institutions and oversight
    - Transparency and public participation
    - Performance-based budgeting and outcome measurement

    Advanced Analysis Topics:
    - Medium-term expenditure frameworks
    - Climate change and green budgeting
    - Digital transformation and e-governance costs
    - Pandemic response and emergency spending
    - Infrastructure investment and public-private partnerships
    - Pension systems and demographic challenges
  `;

  const podcastOptions = [
    {
      title: 'Budget Fundamentals',
      description: 'Basic concepts of government budgeting and fiscal policy',
      query: 'Explain government budget fundamentals including revenue sources, expenditure categories, and basic fiscal policy concepts with examples'
    },
    {
      title: 'Deficit and Debt Analysis',
      description: 'Understanding government debt, deficits, and fiscal sustainability',
      query: 'Analyze government debt and deficit issues including debt-to-GDP ratios, interest burden, and fiscal sustainability with mathematical calculations'
    },
    {
      title: 'Spending Efficiency',
      description: 'Evaluating government spending effectiveness and outcomes',
      query: 'Examine government spending efficiency metrics, cost-benefit analysis, and performance-based budgeting with real-world examples'
    },
    {
      title: 'Tax Policy Impact',
      description: 'How taxation affects economic growth and income distribution',
      query: 'Analyze tax policy impacts on economic growth, income distribution, and government revenue with economic modeling'
    },
    {
      title: 'International Budget Comparisons',
      description: 'Comparing budget structures and fiscal policies across countries',
      query: 'Compare government budget structures and fiscal policies across different countries with specific data and analysis'
    },
    {
      title: 'Crisis Response Budgeting',
      description: 'How governments adjust budgets during economic crises',
      query: 'Explain crisis response budgeting including stimulus packages, emergency spending, and fiscal policy during recessions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Government Budget Analysis</h1>
          <p className="text-xl text-gray-600">AI-powered analysis of government finances and fiscal policy</p>
        </div>

        <Tabs defaultValue="podcast" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="podcast">
              <Volume2 className="mr-2 h-4 w-4" />
              Podcast Analysis
            </TabsTrigger>
            <TabsTrigger value="interactive">
              <Calculator className="mr-2 h-4 w-4" />
              Interactive Analysis
            </TabsTrigger>
            <TabsTrigger value="topics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Budget Topics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="podcast">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Government Budget Analysis Podcast
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of government finances, fiscal policy, and public spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UniversalPodcastPlayer 
                  title="Government Budget Analysis"
                  content={podcastContent}
                  options={{
                    contentType: 'economics',
                    title: 'Government Budget Analysis',
                    description: 'Comprehensive analysis of government finances and fiscal policy',
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
                <CardTitle>Custom Budget Analysis</CardTitle>
                <CardDescription>Get AI-powered analysis for specific countries and budget categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="category">Budget Category (Optional)</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                      Analyzing Budget...
                    </>
                  ) : (
                    'Generate Budget Analysis'
                  )}
                </Button>

                {analysis && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Budget Analysis Results</CardTitle>
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
