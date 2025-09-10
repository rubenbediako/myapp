'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Loader2, TrendingUp, TrendingDown, Building, GraduationCap } from 'lucide-react';
import { analyzeEmployment } from '@/lib/ai';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland'
];

export default function EmploymentUnemploymentPage() {
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

  const handleAnalyze = async () => {
    if (!country) return;
    
    setLoading(true);
    try {
      const result = await analyzeEmployment(country);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing employment:', error);
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
            <h1 className="text-3xl font-bold tracking-tight">Employment & Unemployment Analysis</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered analysis of labor market trends, employment opportunities, and workforce dynamics
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
              <Users className="h-5 w-5" />
              Select Country for Employment Analysis
            </CardTitle>
            <CardDescription>
              Choose a country to analyze employment trends, unemployment rates, and labor market dynamics
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
                  Analyzing Employment Market...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Analyze Employment & Unemployment
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
                  <Building className="h-5 w-5 text-blue-500" />
                  Employment Market Analysis
                </CardTitle>
                <CardDescription>Comprehensive analysis of {country}'s employment and labor market situation</CardDescription>
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
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Job Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Current employment trends and growth sectors in {country}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    Skills Demand
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    In-demand skills and qualifications in the current job market
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building className="h-5 w-5 text-purple-500" />
                    Sector Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Employment opportunities across different industry sectors
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle>Key Recommendations</CardTitle>
                <CardDescription>Strategic recommendations for stakeholders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Badge variant="outline">Job Seekers</Badge>
                    <span className="text-sm">Focus on developing skills in high-demand sectors and consider upskilling opportunities</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <Badge variant="outline">Employers</Badge>
                    <span className="text-sm">Invest in employee training and development to address skills gaps</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <Badge variant="outline">Policymakers</Badge>
                    <span className="text-sm">Support workforce development programs and employment initiatives</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
