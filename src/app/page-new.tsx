'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, BrainCircuit, MessageCircleQuestion, BookOpen, Mic, Scale, Notebook, Building2 } from 'lucide-react';
import { useState } from 'react';
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LandingPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("Global");
  
  const podcastContent = `
    Welcome to Das-AI Economic Intelligence Platform - Your Gateway to Understanding the Global Economy

    Introduction:
    Das-AI is your comprehensive economic intelligence platform, designed to make complex economic data and analysis accessible through interactive podcasts, visualizations, and AI-powered insights. Whether you're a student, professional, or curious individual, our platform transforms economic data into engaging, understandable content.

    Our Core Capabilities:
    
    1. Interactive Economic Analysis
    - Real-time macroeconomic and microeconomic variable tracking
    - Advanced forecasting and predictive modeling
    - Comparative analysis across countries and regions
    - Data visualization with charts, graphs, and interactive dashboards
    
    2. AI-Powered Question Answering
    - Ask Das-AI complex questions about economics, finance, and business
    - Receive custom podcast episodes tailored to your specific queries
    - Get mathematical explanations, formulas, and calculations
    - Access visual content including charts and infographics
    
    3. Personal Finance Intelligence
    - Investment analysis and portfolio recommendations
    - Savings optimization strategies with real-time calculations
    - Budget planning and expense tracking
    - Risk assessment and security analysis
    
    4. Business and Entrepreneurship Hub
    - Comprehensive business plan generation
    - Market analysis and opportunity identification
    - Funding strategy development
    - Startup guidance and scaling strategies
    
    5. Educational Content and Courses
    - Structured learning paths in economics and finance
    - Interactive course materials with podcast integration
    - Real-world case studies and practical applications
    - Certification and assessment tools

    How It Works:
    
    Das-AI transforms traditional economic education by delivering content as engaging podcasts with multimedia support. Every page on our platform is designed with a podcast-first approach, meaning you can:
    
    - Listen to content while reviewing visual data
    - Download audio for offline learning
    - Access transcripts and supporting materials
    - Interact with real-time data and calculations
    - Generate custom content based on your specific needs

    Key Features:
    
    - Universal Podcast Player: Every piece of content is available as high-quality audio
    - Real-time Data Integration: Access to current economic indicators and market data
    - Interactive Visualizations: Charts, graphs, and dashboards that update in real-time
    - Mathematical Modeling: Complex calculations and formulas explained simply
    - Multi-language Support: Content available in multiple languages
    - Mobile-First Design: Optimized for learning on any device
    
    Getting Started:
    
    1. Explore the Dashboard for an overview of global economic indicators
    2. Use Ask Das-AI to get answers to specific questions
    3. Visit the Core Analysis section for deep-dive economic research
    4. Check out Personal Finance tools for individual financial planning
    5. Browse our Educational Courses for structured learning paths

    The Das-AI platform represents the future of economic education - where complex data becomes accessible, engaging, and actionable. Start your journey into economic intelligence today.
  `;

  const podcastOptions = {
    generateAudio: true,
    audioPremium: true,
    includeMusic: true,
    voice: 'alloy' as const,
    includeVisuals: true,
    includeCharts: true,
    includeMath: true
  };

  return (
    <>
      <Head>
        <title>Das-AI - Economic Intelligence Platform</title>
        <meta name="description" content="Transform complex economic data into engaging podcasts and interactive content. Your gateway to understanding the global economy." />
      </Head>
      
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Economic Intelligence Through <span className="text-primary">Interactive Podcasts</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Transform complex economic data into engaging podcasts, visualizations, and AI-powered insights. Learn economics through immersive audio experiences.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg">
                      Start Exploring
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/ask-das-ai">
                    <Button variant="outline" size="lg">
                      <MessageCircleQuestion className="mr-2 h-5 w-5" />
                      Ask Das-AI
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Podcast Player Card */}
              <div className="flex items-center justify-center">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      Platform Overview Podcast
                    </CardTitle>
                    <CardDescription>
                      Learn about Das-AI's capabilities and how to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UniversalPodcastPlayer
                      title="Das-AI Platform Overview"
                      content={podcastContent}
                      options={podcastOptions}
                      autoGenerate={false}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Podcast-First Design */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 space-y-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Podcast-First Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Understand the Economy</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Every feature delivers content as engaging podcasts with interactive visualizations and real-time data.
              </p>
            </div>
            
            <Tabs defaultValue="core-analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="core-analysis">Core Analysis</TabsTrigger>
                <TabsTrigger value="ask-ai">Ask Das-AI</TabsTrigger>
                <TabsTrigger value="personal-finance">Personal Finance</TabsTrigger>
                <TabsTrigger value="entrepreneurship">Entrepreneurship</TabsTrigger>
              </TabsList>
              
              <TabsContent value="core-analysis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5" />
                      Core Economic Analysis
                    </CardTitle>
                    <CardDescription>
                      Analyze macro variables, generate forecasts, and compare economies with podcast explanations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          • Macroeconomic & Microeconomic Variables<br/>
                          • Forecasting & Predictive Models<br/>
                          • Comparative Country Analysis<br/>
                          • Interactive Data Visualizations
                        </p>
                      </div>
                      <Link href="/core-analysis/macroeconomics-variables">
                        <Button>
                          Explore Analysis
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ask-ai" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircleQuestion className="h-5 w-5" />
                      Ask Das-AI
                    </CardTitle>
                    <CardDescription>
                      Get custom podcast episodes answering your economic and business questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          • Custom Podcast Generation<br/>
                          • Complex Question Analysis<br/>
                          • Visual Content Creation<br/>
                          • Mathematical Explanations
                        </p>
                      </div>
                      <Link href="/ask-das-ai">
                        <Button>
                          Ask Questions
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="personal-finance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Personal Finance Intelligence
                    </CardTitle>
                    <CardDescription>
                      Investment analysis, savings optimization, and financial planning through podcasts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          • Investment Portfolio Analysis<br/>
                          • Savings Strategy Optimization<br/>
                          • Risk Assessment Tools<br/>
                          • Budget Planning Guidance
                        </p>
                      </div>
                      <Link href="/personal-finance">
                        <Button>
                          Plan Finances
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="entrepreneurship" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Entrepreneurship Hub
                    </CardTitle>
                    <CardDescription>
                      Business plan generation and startup guidance through comprehensive podcast content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          • Business Plan Generation<br/>
                          • Market Analysis Tools<br/>
                          • Funding Strategy Development<br/>
                          • Startup Guidance Podcasts
                        </p>
                      </div>
                      <Link href="/entrepreneurship-hub">
                        <Button>
                          Start Building
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">Quick Start Guide</h2>
                <p className="text-muted-foreground">
                  New to Das-AI? Here's how to get the most out of our podcast-first platform:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-xs font-medium">1</div>
                    <div>
                      <h4 className="font-medium">Explore the Dashboard</h4>
                      <p className="text-sm text-muted-foreground">Get an overview of global economic indicators with podcast explanations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-xs font-medium">2</div>
                    <div>
                      <h4 className="font-medium">Ask Specific Questions</h4>
                      <p className="text-sm text-muted-foreground">Use Ask Das-AI to generate custom podcast content for your queries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-xs font-medium">3</div>
                    <div>
                      <h4 className="font-medium">Dive Deeper</h4>
                      <p className="text-sm text-muted-foreground">Explore specialized sections for detailed analysis and learning</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Areas</CardTitle>
                    <CardDescription>Most accessed sections of the platform</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/dashboard" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Economic Dashboard
                      </Button>
                    </Link>
                    <Link href="/personal-finance" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <Scale className="mr-2 h-4 w-4" />
                        Personal Finance
                      </Button>
                    </Link>
                    <Link href="/savings" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <Notebook className="mr-2 h-4 w-4" />
                        Savings Analysis
                      </Button>
                    </Link>
                    <Link href="/courses" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Learning Courses
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="mx-auto px-4 md:px-6">
            <div className="grid items-center justify-center gap-4 text-center">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Transform Your Economic Understanding?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start your journey with podcast-first economic intelligence. Every page delivers content as engaging audio with interactive visuals.
                </p>
              </div>
              <div className="mt-6 flex gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg">
                    Explore Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/ask-das-ai">
                  <Button variant="outline" size="lg">
                    <Mic className="mr-2 h-5 w-5" />
                    Ask Das-AI
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
