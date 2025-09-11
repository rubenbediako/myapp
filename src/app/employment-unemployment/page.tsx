'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Loader2, TrendingUp, TrendingDown, Building, GraduationCap, Volume2, BarChart3 } from 'lucide-react';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'India', 'United Kingdom', 
  'France', 'Italy', 'Brazil', 'Canada', 'Russia', 'South Korea', 
  'Australia', 'Spain', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland'
];

const employmentSectors = [
  'Manufacturing', 'Services', 'Agriculture', 'Technology', 'Healthcare', 
  'Education', 'Construction', 'Retail', 'Finance', 'Transportation'
];

export default function EmploymentUnemploymentPage() {
  const [country, setCountry] = useState('');
  const [sector, setSector] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

  const handleAnalyze = async () => {
    if (!country) return;
    
    setLoading(true);
    try {
      const query = sector 
        ? `Analyze employment and unemployment trends in the ${sector} sector for ${country}. Include sector-specific job market trends, skills demand, wage levels, and future outlook.`
        : `Analyze employment and unemployment trends for ${country}. Include current unemployment rates, job market trends, labor force participation, sectoral employment, and economic factors affecting employment.`;
        
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
        throw new Error('Failed to analyze employment');
      }

      const result = await response.json();
      setAnalysis(result.response || 'Employment analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing employment:', error);
      setAnalysis('Failed to analyze employment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const podcastContent = `
    Employment and Unemployment Analysis - Understanding Labor Market Dynamics

    Introduction:
    Employment and unemployment are critical indicators of economic health and social well-being. This comprehensive analysis explores labor market dynamics, employment trends, and the factors that influence job creation and unemployment rates across different economies.

    Core Labor Market Concepts:

    1. Employment Metrics and Indicators
    - Labor force participation rates and definitions
    - Employment-to-population ratios
    - Unemployment rate calculations and interpretations
    - Underemployment and discouraged worker effects
    - Job creation and destruction rates
    - Employment quality and job security measures

    2. Types of Unemployment
    - Frictional unemployment and job search theory
    - Structural unemployment and skill mismatches
    - Cyclical unemployment and business cycle effects
    - Seasonal unemployment patterns
    - Technological unemployment and automation impacts
    - Long-term unemployment and hysteresis effects

    3. Labor Market Dynamics
    - Job matching and search processes
    - Labor mobility and geographic considerations
    - Skills development and human capital theory
    - Education-employment relationships
    - Training and reskilling programs
    - Labor market flexibility and rigidity

    4. Sectoral Employment Analysis
    - Manufacturing employment trends and deindustrialization
    - Service sector growth and job creation
    - Agricultural employment and rural-urban migration
    - Technology sector employment and digital transformation
    - Healthcare and education employment growth
    - Green jobs and sustainable employment

    5. Demographics and Employment
    - Youth unemployment and school-to-work transitions
    - Gender employment gaps and workplace equality
    - Age-related employment patterns and older workers
    - Immigration and labor market impacts
    - Minority employment disparities
    - Regional employment variations

    Economic Factors Affecting Employment:

    1. Macroeconomic Influences
    - GDP growth and employment correlation
    - Monetary policy impacts on job creation
    - Fiscal policy and government employment programs
    - International trade effects on domestic employment
    - Exchange rates and export-sector employment

    2. Labor Market Policies
    - Minimum wage policies and employment effects
    - Unemployment insurance and benefit systems
    - Active labor market policies and job placement
    - Employment protection legislation
    - Work-sharing and flexible employment arrangements

    3. Technological and Structural Changes
    - Automation and artificial intelligence impacts
    - Digital platform economy and gig work
    - Remote work and telecommuting trends
    - Industry 4.0 and manufacturing employment
    - Skill-biased technological change

    4. Global Employment Trends
    - Globalization and job displacement
    - Offshoring and reshoring patterns
    - International labor migration
    - Multinational corporation employment strategies
    - Supply chain employment effects

    Employment Policy and Future Outlook:

    1. Policy Interventions
    - Job creation programs and public works
    - Skills training and vocational education
    - Entrepreneurship support and small business development
    - Regional development and place-based policies
    - Social safety nets and employment support

    2. Future of Work
    - Changing nature of employment relationships
    - Lifelong learning and continuous reskilling
    - Universal basic income debates
    - Work-life balance and flexible arrangements
    - Sustainability and green employment transitions
  `;

  const podcastOptions = [
    {
      title: 'Labor Market Fundamentals',
      description: 'Understanding employment metrics and unemployment types',
      query: 'Explain labor market fundamentals including employment metrics, unemployment types, and labor force participation with examples and calculations'
    },
    {
      title: 'Youth Employment Challenges',
      description: 'Analyzing youth unemployment and school-to-work transitions',
      query: 'Analyze youth employment challenges including education-job mismatches, entry-level job markets, and policy solutions'
    },
    {
      title: 'Technology and Employment',
      description: 'Impact of automation and AI on jobs and skills',
      query: 'Examine technology impacts on employment including automation, AI, digital transformation, and future skill requirements'
    },
    {
      title: 'Gender Employment Gaps',
      description: 'Understanding workplace equality and gender disparities',
      query: 'Analyze gender employment gaps including pay equity, career advancement, and policy interventions for workplace equality'
    },
    {
      title: 'Regional Employment Patterns',
      description: 'Geographic variations in employment and economic development',
      query: 'Examine regional employment patterns including urban-rural differences, industrial clusters, and regional development policies'
    },
    {
      title: 'Future of Work',
      description: 'Changing employment relationships and work arrangements',
      query: 'Explore the future of work including gig economy, remote work, flexible arrangements, and changing employment relationships'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Employment & Unemployment Analysis</h1>
          <p className="text-xl text-gray-600">AI-powered analysis of labor market trends and workforce dynamics</p>
        </div>

        <Tabs defaultValue="podcast" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="podcast">
              <Volume2 className="mr-2 h-4 w-4" />
              Podcast Analysis
            </TabsTrigger>
            <TabsTrigger value="interactive">
              <BarChart3 className="mr-2 h-4 w-4" />
              Interactive Analysis
            </TabsTrigger>
            <TabsTrigger value="topics">
              <Users className="mr-2 h-4 w-4" />
              Employment Topics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="podcast">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Employment & Unemployment Analysis Podcast
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of labor markets, employment trends, and workforce dynamics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UniversalPodcastPlayer 
                  title="Employment & Unemployment Analysis"
                  content={podcastContent}
                  options={{
                    contentType: 'economics',
                    title: 'Employment & Unemployment Analysis',
                    description: 'Comprehensive analysis of labor markets and workforce dynamics',
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
                <CardTitle>Custom Employment Analysis</CardTitle>
                <CardDescription>Get AI-powered analysis for specific countries and employment sectors</CardDescription>
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
                    <Label htmlFor="sector">Employment Sector (Optional)</Label>
                    <Select value={sector} onValueChange={setSector}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentSectors.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
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
                      Analyzing Employment Data...
                    </>
                  ) : (
                    'Generate Employment Analysis'
                  )}
                </Button>

                {analysis && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Employment Analysis Results</CardTitle>
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
