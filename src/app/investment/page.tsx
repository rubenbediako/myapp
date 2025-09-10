'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Loader2, Target, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { analyzeInvestment } from '@/lib/ai';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland'
];

const investmentTypes = [
  'Stocks & Equities', 'Government Bonds', 'Corporate Bonds', 'Real Estate',
  'Technology Sector', 'Healthcare Sector', 'Energy Sector', 'Financial Services',
  'Commodities', 'Foreign Exchange', 'Emerging Markets', 'Infrastructure',
  'Green Energy', 'Cryptocurrency', 'Private Equity', 'Mutual Funds'
];

export default function InvestmentPage() {
  const [country, setCountry] = useState('');
  const [investmentType, setInvestmentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!country || !investmentType) return;
    
    setLoading(true);
    try {
      const result = await analyzeInvestment(country, investmentType);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing investment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Investment Analysis</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered investment analysis and market opportunity assessment
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

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Investment Configuration
            </CardTitle>
            <CardDescription>
              Select a country and investment type for AI-powered market analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Target Market</Label>
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

              <div className="space-y-2">
                <Label htmlFor="investmentType">Investment Type</Label>
                <Select value={investmentType} onValueChange={setInvestmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {investmentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleAnalyze}
              disabled={!country || !investmentType || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Investment Opportunities...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analyze Investment
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Market Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
                <CardDescription>Current investment market conditions and outlook</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.marketOverview}</p>
              </CardContent>
            </Card>

            {/* Investment Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Investment Opportunities
                </CardTitle>
                <CardDescription>Key sectors and opportunities identified by AI analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.opportunities?.map((opportunity: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{opportunity.sector}</h4>
                        <div className="flex items-center gap-2">
                          {getRiskIcon(opportunity.riskLevel)}
                          <Badge className={getRiskColor(opportunity.riskLevel)}>
                            {opportunity.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{opportunity.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Expected Return: {opportunity.expectedReturn}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risks & Timeline */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Investment Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.risks?.map((risk: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                        <span className="text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Investment Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{analysis.timeline}</p>
                </CardContent>
              </Card>
            </div>

            {/* Diversification Strategy */}
            <Card>
              <CardHeader>
                <CardTitle>Diversification Strategy</CardTitle>
                <CardDescription>AI-recommended portfolio diversification approach</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.diversificationStrategy}</p>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Recommendations</CardTitle>
                <CardDescription>AI-generated strategic recommendations for your investment approach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.recommendations?.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
