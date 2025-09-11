'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Wallet, Loader2, PiggyBank, Target, Calendar, Shield, Volume2, Calculator } from 'lucide-react';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland'
];

const ageRanges = [
  '18-25', '26-35', '36-45', '46-55', '56-65', '65+'
];

const goals = [
  'Emergency Fund', 'House Purchase', 'Retirement Planning', 'Education Fund',
  'Debt Reduction', 'Investment Growth', 'Business Startup', 'Travel Fund',
  'Insurance Planning', 'Tax Optimization'
];

export default function PersonalFinancePage() {
  const [country, setCountry] = useState('');
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [age, setAge] = useState('');
  const [financialGoals, setFinancialGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleGoalToggle = (goal: string) => {
    setFinancialGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleAnalyze = async () => {
    if (!country || !income || !expenses || !age || financialGoals.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/ask-das-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Analyze personal finance for ${country} citizen with income $${income}, expenses $${expenses}, age ${age}, goals: ${financialGoals.join(', ')}`,
          mode: 'enhanced'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze personal finance');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing personal finance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate content for podcast
  const podcastContent = useMemo(() => {
    if (!country || !income || !expenses || !age || financialGoals.length === 0) {
      return `Personal Finance Analysis Guide
      
      Learn about comprehensive financial planning including:
      - Income and expense management
      - Budgeting strategies and techniques
      - Investment planning and portfolio optimization
      - Debt management and reduction strategies
      - Retirement planning calculations
      - Emergency fund planning
      - Tax optimization strategies
      - Risk management and insurance planning
      
      Discover mathematical models for financial calculations, statistical analysis of investment returns, and evidence-based financial planning strategies.`;
    }

    const monthlyIncome = parseFloat(income) || 0;
    const monthlyExpenses = parseFloat(expenses) || 0;
    const monthlySavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

    return `Personal Finance Analysis for ${age} year old in ${country}

    Financial Profile:
    - Monthly Income: $${monthlyIncome.toLocaleString()}
    - Monthly Expenses: $${monthlyExpenses.toLocaleString()}
    - Monthly Savings: $${monthlySavings.toLocaleString()}
    - Savings Rate: ${savingsRate.toFixed(2)}%
    
    Financial Goals: ${financialGoals.join(', ')}
    
    Provide comprehensive financial analysis including:
    - Detailed budgeting recommendations with mathematical calculations
    - Investment allocation strategies based on age and risk tolerance
    - Emergency fund calculations (3-6 months of expenses)
    - Retirement planning with compound interest calculations
    - Debt management strategies and payoff timelines
    - Tax optimization techniques for ${country}
    - Insurance planning and coverage recommendations
    - Economic factors affecting financial planning in ${country}
    
    Include mathematical formulas for financial calculations, statistical analysis, and comparative data with national averages and benchmarks.`;
  }, [country, income, expenses, age, financialGoals]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Personal Finance Analysis</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered personal financial planning and investment guidance
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

        <Tabs defaultValue="input" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Financial Input
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Analysis Results
            </TabsTrigger>
            <TabsTrigger value="podcast" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              AI Podcast Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Financial Profile
                </CardTitle>
                <CardDescription>
                  Enter your financial information for personalized AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age Range</Label>
                    <Select value={age} onValueChange={setAge}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageRanges.map(range => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="income">Monthly Income</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="Enter monthly income"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expenses">Monthly Expenses</Label>
                    <Input
                      id="expenses"
                      type="number"
                      placeholder="Enter monthly expenses"
                      value={expenses}
                      onChange={(e) => setExpenses(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Financial Goals</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {goals.map(goal => (
                      <Button
                        key={goal}
                        variant={financialGoals.includes(goal) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleGoalToggle(goal)}
                        className="justify-start"
                      >
                        {goal}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selected: {financialGoals.length} goal{financialGoals.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <Button 
                  onClick={handleAnalyze}
                  disabled={!country || !income || !expenses || !age || financialGoals.length === 0 || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Your Financial Profile...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Analyze Personal Finance
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Analysis Results */}
            {analysis ? (
              <div className="space-y-6">
                {/* Financial Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                    <CardDescription>Summary of your current financial situation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{analysis.overview}</p>
                  </CardContent>
                </Card>

                {/* Financial Planning Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        Budgeting Advice
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{analysis.budgetingAdvice}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PiggyBank className="h-5 w-5 text-green-500" />
                        Savings Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{analysis.savingsRecommendations}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Investment & Debt Management */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Guidance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{analysis.investmentGuidance}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Debt Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{analysis.debtManagement}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Retirement & Emergency Fund */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        Retirement Planning
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{analysis.retirementPlanning}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-orange-500" />
                        Emergency Fund
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{analysis.emergencyFund}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Action Items</CardTitle>
                    <CardDescription>Prioritized steps to improve your financial situation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.actionItems?.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Implementation Timeline
                    </CardTitle>
                    <CardDescription>Suggested timeline for implementing financial changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{analysis.timeline}</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
                  <p className="text-muted-foreground text-center">
                    Please complete your financial profile in the input tab and run the analysis.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="podcast" className="space-y-6">
            <UniversalPodcastPlayer
              title="Personal Finance Analysis"
              content={podcastContent}
              options={{
                contentType: 'personal-finance',
                title: 'Personal Finance Analysis',
                description: 'Comprehensive financial planning and investment guidance',
                data: { country, income, expenses, age, financialGoals, analysis },
                includeMath: true,
                includeCharts: true,
                includeStatistics: true,
                audioPremium: true
              }}
              autoGenerate={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
