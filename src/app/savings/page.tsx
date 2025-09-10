'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, PiggyBank, Loader2, TrendingUp, Target, Calendar } from 'lucide-react';
import { analyzeSavings } from '@/lib/ai';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland'
];

export default function SavingsPage() {
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

  const handleAnalyze = async () => {
    if (!country) return;
    
    setLoading(true);
    try {
      const result = await analyzeSavings(country);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing savings:', error);
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
            <h1 className="text-3xl font-bold tracking-tight">Savings Analysis</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered analysis of savings patterns, opportunities, and strategic recommendations
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
              <PiggyBank className="h-5 w-5" />
              Select Country for Savings Analysis
            </CardTitle>
            <CardDescription>
              Choose a country to analyze savings trends, rates, and investment opportunities
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

            <Button 
              onClick={handleAnalyze}
              disabled={!country || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Savings Market...
                </>
              ) : (
                <>
                  <PiggyBank className="mr-2 h-4 w-4" />
                  Analyze Savings Opportunities
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Main Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Savings Market Analysis
                </CardTitle>
                <CardDescription>Comprehensive analysis of {country}'s savings landscape and opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {analysis}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PiggyBank className="h-5 w-5 text-blue-500" />
                    Savings Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Current savings rates and trends in {country}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-green-500" />
                    Investment Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Available investment vehicles and their performance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Long-term Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Strategic recommendations for long-term wealth building
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
