'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, GitCompare, Loader2, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland'
];

const indicators = [
  'GDP Growth', 'Economic Development', 'Trade Relations', 'Innovation Index',
  'Business Environment', 'Labor Market', 'Infrastructure', 'Education System',
  'Healthcare System', 'Financial Markets', 'Government Policies', 'Digital Economy'
];

export default function ComparativeAnalysisPage() {
  const [country1, setCountry1] = useState('');
  const [country2, setCountry2] = useState('');
  const [indicator, setIndicator] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!country1 || !country2 || !indicator) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/ask-das-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Compare ${indicator} between ${country1} and ${country2}. Provide detailed analysis with current data, historical trends, and key differences in economic performance.`,
          mode: 'enhanced'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to compare countries');
      }

      const result = await response.json();
      setAnalysis(result.response || 'Analysis completed successfully');
    } catch (error) {
      console.error('Error comparing countries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Comparative Economic Analysis</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered comparative analysis between countries across key economic indicators
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
              <GitCompare className="h-5 w-5" />
              Select Countries & Indicator
            </CardTitle>
            <CardDescription>
              Choose two countries and an economic indicator for AI-powered comparative analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country1">First Country</Label>
                <Select value={country1} onValueChange={setCountry1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country2">Second Country</Label>
                <Select value={country2} onValueChange={setCountry2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.filter(c => c !== country1).map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indicator">Economic Indicator</Label>
                <Select value={indicator} onValueChange={setIndicator}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select indicator" />
                  </SelectTrigger>
                  <SelectContent>
                    {indicators.map(i => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleAnalyze}
              disabled={!country1 || !country2 || !indicator || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Performing Comparative Analysis...
                </>
              ) : (
                <>
                  <GitCompare className="mr-2 h-4 w-4" />
                  Compare Countries
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Country Analyses */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">{country1}</Badge>
                    Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{analysis.country1Analysis}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">{country2}</Badge>
                    Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{analysis.country2Analysis}</p>
                </CardContent>
              </Card>
            </div>

            {/* Key Differences & Similarities */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Key Differences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.keyDifferences?.map((difference: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                        <span className="text-sm">{difference}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Similarities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.similarities?.map((similarity: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                        <span className="text-sm">{similarity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Competitive Advantages */}
            <Card>
              <CardHeader>
                <CardTitle>Competitive Advantages</CardTitle>
                <CardDescription>Unique strengths and advantages of each country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline">{country1}</Badge>
                      Advantages
                    </h4>
                    <div className="space-y-2">
                      {analysis.competitiveAdvantages?.country1?.map((advantage: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">{advantage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline">{country2}</Badge>
                      Advantages
                    </h4>
                    <div className="space-y-2">
                      {analysis.competitiveAdvantages?.country2?.map((advantage: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">{advantage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Strategic Recommendations</CardTitle>
                <CardDescription>AI-generated recommendations for each country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline">{country1}</Badge>
                      Recommendations
                    </h4>
                    <div className="space-y-2">
                      {analysis.recommendations?.country1?.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline">{country2}</Badge>
                      Recommendations
                    </h4>
                    <div className="space-y-2">
                      {analysis.recommendations?.country2?.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Insights</CardTitle>
                <CardDescription>Comprehensive analysis summary and strategic insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.overallInsights}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
