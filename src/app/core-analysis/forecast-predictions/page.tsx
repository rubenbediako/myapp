'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Loader2, TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react';
import { generateForecast } from '@/lib/ai';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland'
];

const timeframes = [
  '1-2 years (Short Term)',
  '3-5 years (Medium Term)', 
  '5+ years (Long Term)',
  '10+ years (Extended Term)'
];

const factors = [
  'GDP Growth', 'Inflation Trends', 'Employment Rates', 'Interest Rates',
  'Government Policy', 'Trade Relations', 'Technology Adoption', 'Demographics',
  'Climate Change', 'Infrastructure', 'Innovation Index', 'Political Stability'
];

export default function ForecastPredictionsPage() {
  const [country, setCountry] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFactorToggle = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  const handleAnalyze = async () => {
    if (!country || !timeframe || selectedFactors.length === 0) return;
    
    setLoading(true);
    try {
      const result = await generateForecast(country, timeframe, selectedFactors);
      setAnalysis(result);
    } catch (error) {
      console.error('Error generating forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    if (timeframe.includes('Short')) return <Clock className="h-4 w-4 text-blue-500" />;
    if (timeframe.includes('Medium')) return <Clock className="h-4 w-4 text-yellow-500" />;
    if (timeframe.includes('Long')) return <Clock className="h-4 w-4 text-green-500" />;
    return <Clock className="h-4 w-4 text-purple-500" />;
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Economic Forecast & Predictions</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered economic forecasting and predictive analysis across multiple time horizons
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
              <Sparkles className="h-5 w-5" />
              Forecast Configuration
            </CardTitle>
            <CardDescription>
              Configure your economic forecast by selecting country, timeframe, and key factors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="timeframe">Forecast Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Economic Factors</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {factors.map(factor => (
                  <Button
                    key={factor}
                    variant={selectedFactors.includes(factor) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFactorToggle(factor)}
                    className="justify-start"
                  >
                    {factor}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFactors.length} factor{selectedFactors.length !== 1 ? 's' : ''}
              </p>
            </div>

            <Button 
              onClick={handleAnalyze}
              disabled={!country || !timeframe || selectedFactors.length === 0 || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Economic Forecast...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Forecast
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Forecast Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Forecast Overview</CardTitle>
                <CardDescription>Executive summary of economic predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.summary}</p>
              </CardContent>
            </Card>

            {/* Time-based Forecasts */}
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getTimeframeIcon('Short')}
                    Short Term Forecast (1-2 years)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{analysis.shortTermForecast}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getTimeframeIcon('Medium')}
                    Medium Term Forecast (3-5 years)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{analysis.mediumTermForecast}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getTimeframeIcon('Long')}
                    Long Term Forecast (5+ years)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{analysis.longTermForecast}</p>
                </CardContent>
              </Card>
            </div>

            {/* Key Drivers & Risk Factors */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Key Growth Drivers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.keyDrivers?.map((driver: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                        <span className="text-sm">{driver}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.riskFactors?.map((risk: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                        <span className="text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scenarios Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Scenario Analysis</CardTitle>
                <CardDescription>Different economic scenarios and their probabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.scenarios?.map((scenario: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{scenario.name}</h4>
                        <Badge className="text-xs">
                          Probability: {scenario.probability}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{scenario.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Impact:</span>
                        <span className="text-xs">{scenario.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Strategic Recommendations</CardTitle>
                <CardDescription>AI-generated recommendations based on forecast analysis</CardDescription>
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
