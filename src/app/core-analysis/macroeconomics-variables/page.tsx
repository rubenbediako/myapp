'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia'
];

const macroIndicators = [
  'GDP Growth Rate',
  'Inflation Rate', 
  'Unemployment Rate',
  'Interest Rates',
  'Government Debt',
  'Trade Balance',
  'Current Account',
  'Exchange Rate',
  'Money Supply',
  'Fiscal Balance'
];

export default function MacroeconomicsVariablesPage() {
  const [country, setCountry] = useState('');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleIndicatorToggle = (indicator: string) => {
    setSelectedIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const handleAnalyze = async () => {
    if (!country || selectedIndicators.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/ask-das-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Analyze macroeconomic indicators for ${country}: ${selectedIndicators.join(', ')}. Include current values, historical trends, international comparisons, and policy implications.`,
          mode: 'enhanced'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze macroeconomics');
      }

      const result = await response.json();
      setAnalysis(result.response || 'Analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing macroeconomics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'bg-green-100 text-green-800';
      case 'decreasing': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Macroeconomics Variables Analysis</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered analysis of macroeconomic indicators and trends
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Select Country & Indicators
          </CardTitle>
          <CardDescription>
            Choose a country and macroeconomic indicators for AI-powered analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
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

          <div className="space-y-3">
            <Label>Macroeconomic Indicators</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {macroIndicators.map(indicator => (
                <Button
                  key={indicator}
                  variant={selectedIndicators.includes(indicator) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleIndicatorToggle(indicator)}
                  className="justify-start"
                >
                  {indicator}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Selected: {selectedIndicators.length} indicator{selectedIndicators.length !== 1 ? 's' : ''}
            </p>
          </div>

          <Button 
            onClick={handleAnalyze}
            disabled={!country || selectedIndicators.length === 0 || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Macroeconomic Data...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analyze Macroeconomic Variables
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Key Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Key Economic Indicators</CardTitle>
              <CardDescription>Current state and trends of selected indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {analysis.keyIndicators?.map((indicator: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(indicator.trend)}
                      <div>
                        <h4 className="font-semibold">{indicator.indicator}</h4>
                        <p className="text-sm text-muted-foreground">{indicator.significance}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{indicator.value}</div>
                      <Badge className={getTrendColor(indicator.trend)}>
                        {indicator.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>GDP Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.gdpAnalysis}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inflation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.inflationTrends}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employment Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.unemploymentInsights}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Policy Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold mb-1">Fiscal Policy</h5>
                    <p className="text-sm text-muted-foreground">{analysis.fiscalPolicy}</p>
                  </div>
                  <Separator />
                  <div>
                    <h5 className="font-semibold mb-1">Monetary Policy</h5>
                    <p className="text-sm text-muted-foreground">{analysis.monetaryPolicy}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations and Risks */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations?.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">Risk Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.riskFactors?.map((risk: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
