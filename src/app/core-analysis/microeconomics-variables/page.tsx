'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland'
];

const sectors = [
  'Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 
  'Energy', 'Agriculture', 'Retail', 'Transportation', 'Real Estate',
  'Telecommunications', 'Entertainment', 'Education', 'Construction',
  'Automotive', 'Aerospace', 'Food & Beverage', 'Tourism', 'Mining'
];

export default function MicroeconomicsVariablesPage() {
  const [country, setCountry] = useState('');
  const [sector, setSector] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!country || !sector) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/ask-das-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Analyze microeconomic factors for the ${sector} sector in ${country}. Include market structure, competition analysis, supply and demand dynamics, and business environment factors.`,
          mode: 'enhanced'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze microeconomics');
      }

      const result = await response.json();
      setAnalysis(result.response || 'Analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing microeconomics:', error);
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
            <h1 className="text-3xl font-bold tracking-tight">Microeconomics Variables</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered analysis of market structure, competition, and business dynamics
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
              <Building2 className="h-5 w-5" />
              Select Country & Sector
            </CardTitle>
            <CardDescription>
              Choose a country and industry sector for AI-powered microeconomic analysis
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
                <Label htmlFor="sector">Industry Sector</Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an industry sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleAnalyze}
              disabled={!country || !sector || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Microeconomic Environment...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Analyze Microeconomic Variables
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Market Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Market Structure Analysis</CardTitle>
                <CardDescription>Industry structure and competitive dynamics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.marketStructure}</p>
              </CardContent>
            </Card>

            {/* Supply & Demand */}
            <Card>
              <CardHeader>
                <CardTitle>Supply & Demand Dynamics</CardTitle>
                <CardDescription>Market forces and equilibrium analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.supplyDemand}</p>
              </CardContent>
            </Card>

            {/* Analysis Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Elasticity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{analysis.priceElasticity}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Consumer Behavior</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{analysis.consumerBehavior}</p>
                </CardContent>
              </Card>
            </div>

            {/* Competition Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Competition Analysis</CardTitle>
                <CardDescription>Competitive landscape and market dynamics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.competitionAnalysis}</p>
              </CardContent>
            </Card>

            {/* Strategies & Opportunities */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.businessStrategies?.map((strategy: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                        <span className="text-sm">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.marketOpportunities?.map((opportunity: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Challenges */}
            <Card>
              <CardHeader>
                <CardTitle>Market Challenges</CardTitle>
                <CardDescription>Key challenges and barriers in the market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.challenges?.map((challenge: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm">{challenge}</span>
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
