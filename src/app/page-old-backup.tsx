'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, BrainCircuit, MessageCircleQuestion, BookOpen, Mic, Scale, Notebook, Building2, Radio } from 'lucide-react';
import { useState } from 'react';
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';
import { OnlineRadioPlayer } from '@/components/online-radio-player';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LandingPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("Global");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    includeMath: true,
    contentType: 'general' as const,
    title: 'Platform Overview'
  };

  return (
    <>
      <Head>
        <title>Das-AI - Economic Intelligence Platform</title>
        <meta name="description" content="Transform complex economic data into engaging podcasts and interactive content. Your gateway to understanding the global economy." />
      </Head>
      
      <div className="flex flex-col min-h-screen">
        {/* Mobile Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Das-AI</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted"
              >
                <div className="flex flex-col space-y-1">
                  <span className={`block h-0.5 w-6 bg-current transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block h-0.5 w-6 bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-0.5 w-6 bg-current transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
            {mobileMenuOpen && (
              <div className="border-t pb-4 pt-4">
                <nav className="grid gap-2">
                  <Link href="/dashboard" className="flex items-center space-x-3 py-2 text-sm font-medium hover:text-primary">
                    <BarChart2 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/ask-das-ai" className="flex items-center space-x-3 py-2 text-sm font-medium hover:text-primary">
                    <MessageCircleQuestion className="h-4 w-4" />
                    <span>Ask Das-AI</span>
                  </Link>
                  <Link href="/personal-finance" className="flex items-center space-x-3 py-2 text-sm font-medium hover:text-primary">
                    <Scale className="h-4 w-4" />
                    <span>Personal Finance</span>
                  </Link>
                  <Link href="/courses" className="flex items-center space-x-3 py-2 text-sm font-medium hover:text-primary">
                    <BookOpen className="h-4 w-4" />
                    <span>Courses</span>
                  </Link>
                  <Link href="/entrepreneurship-hub" className="flex items-center space-x-3 py-2 text-sm font-medium hover:text-primary">
                    <Building2 className="h-4 w-4" />
                    <span>Business Hub</span>
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="w-full py-8 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6 order-2 lg:order-1">
                <div className="space-y-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                    Economic Intelligence Through{' '}
                    <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      Interactive Podcasts
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl">
                    Transform complex economic data into engaging podcasts, visualizations, and AI-powered insights. Learn economics through immersive audio experiences.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start Exploring
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/ask-das-ai" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <MessageCircleQuestion className="mr-2 h-5 w-5" />
                      Ask Das-AI
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Radio className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    🔴 <strong>Live:</strong> BBC World Service • Bloomberg Radio • Ghana & African Stations
                  </span>
                </div>
              </div>
              
              {/* Podcast Player Card */}
              <div className="flex items-center justify-center order-1 lg:order-2">
                <Card className="w-full max-w-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Mic className="h-5 w-5" />
                      Platform Overview Podcast
                    </CardTitle>
                    <CardDescription className="text-sm">
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

        {/* Live Radio Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:gap-8 xl:gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Radio className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                    <span className="text-red-500 text-sm font-medium uppercase tracking-wide">Live Radio</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                    Stay Connected with Live Economic News
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-3xl">
                    Listen to BBC World Service, Bloomberg Radio, and trusted African stations including Joy FM, Citi FM, and other leading Ghana and African radio networks for real-time economic updates.
                  </p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2 p-3 sm:p-4 rounded-lg bg-background/50">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">BBC World Service</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Global news and analysis</p>
                  </div>
                  <div className="space-y-2 p-3 sm:p-4 rounded-lg bg-background/50">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Bloomberg Radio</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Financial markets & business</p>
                  </div>
                  <div className="space-y-2 p-3 sm:p-4 rounded-lg bg-background/50 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Ghana & African Stations</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Joy FM, Citi FM, Peace FM & more</p>
                  </div>
                </div>                  <div className="pt-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      🎵 <strong>15+ Premium Stations:</strong> Joy FM Ghana, Citi FM, Peace FM, YFM, Capital FM Kenya, Metro FM South Africa, KFM Uganda, Wazobia FM Nigeria, and major African networks available 24/7.
                    </p>
                  </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <OnlineRadioPlayer compact={true} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Podcast-First Design */}
        <section id="features" className="w-full py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 sm:space-y-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Podcast-First Features</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-4xl">
                  Everything You Need to Understand the Economy
                </h2>
                <p className="max-w-3xl text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl">
                  Every feature delivers content as engaging podcasts with interactive visualizations and real-time data.
                </p>
              </div>
              
              <Tabs defaultValue="core-analysis" className="w-full">
                <div className="w-full overflow-x-auto">
                  <TabsList className="grid w-full min-w-max grid-cols-5 lg:min-w-0">
                    <TabsTrigger value="core-analysis" className="text-xs sm:text-sm whitespace-nowrap">Core Analysis</TabsTrigger>
                    <TabsTrigger value="ask-ai" className="text-xs sm:text-sm whitespace-nowrap">Ask Das-AI</TabsTrigger>
                    <TabsTrigger value="personal-finance" className="text-xs sm:text-sm whitespace-nowrap">Personal Finance</TabsTrigger>
                    <TabsTrigger value="entrepreneurship" className="text-xs sm:text-sm whitespace-nowrap">Entrepreneurship</TabsTrigger>
                    <TabsTrigger value="live-radio" className="text-xs sm:text-sm whitespace-nowrap">Live Radio</TabsTrigger>
                  </TabsList>
                </div>
              
              <TabsContent value="core-analysis" className="space-y-4 mt-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BrainCircuit className="h-5 w-5" />
                      Core Economic Analysis
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Analyze macro variables, generate forecasts, and compare economies with podcast explanations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="space-y-2 flex-1">
                        <p className="text-sm text-muted-foreground">
                          • Macroeconomic & Microeconomic Variables<br/>
                          • Forecasting & Predictive Models<br/>
                          • Comparative Country Analysis<br/>
                          • Interactive Data Visualizations
                        </p>
                      </div>
                      <Link href="/core-analysis/macroeconomics-variables" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                          Explore Analysis
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ask-ai" className="space-y-4 mt-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageCircleQuestion className="h-5 w-5" />
                      Ask Das-AI
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Get custom podcast episodes answering your economic and business questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="space-y-2 flex-1">
                        <p className="text-sm text-muted-foreground">
                          • Custom Podcast Generation<br/>
                          • Complex Question Analysis<br/>
                          • Visual Content Creation<br/>
                          • Mathematical Explanations
                        </p>
                      </div>
                      <Link href="/ask-das-ai" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                          Ask Questions
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="personal-finance" className="space-y-4 mt-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Scale className="h-5 w-5" />
                      Personal Finance Intelligence
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Investment analysis, savings optimization, and financial planning through podcasts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="space-y-2 flex-1">
                        <p className="text-sm text-muted-foreground">
                          • Investment Portfolio Analysis<br/>
                          • Savings Strategy Optimization<br/>
                          • Risk Assessment Tools<br/>
                          • Budget Planning Guidance
                        </p>
                      </div>
                      <Link href="/personal-finance" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                          Plan Finances
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="entrepreneurship" className="space-y-4 mt-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="h-5 w-5" />
                      Entrepreneurship Hub
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Business plan generation and startup guidance through comprehensive podcast content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="space-y-2 flex-1">
                        <p className="text-sm text-muted-foreground">
                          • Business Plan Generation<br/>
                          • Market Analysis Tools<br/>
                          • Funding Strategy Development<br/>
                          • Startup Guidance Podcasts
                        </p>
                      </div>
                      <Link href="/entrepreneurship-hub" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                          Start Building
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="live-radio" className="space-y-4 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Radio className="h-5 w-5" />
                        Live Economic Radio
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Stay updated with real-time news from BBC World Service, Bloomberg Radio, Joy FM Ghana, and African stations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                            <div>
                              <div className="font-medium text-sm">BBC World Service</div>
                              <div className="text-xs text-muted-foreground">Global news, analysis, and current affairs</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                            <div>
                              <div className="font-medium text-sm">Bloomberg Radio</div>
                              <div className="text-xs text-muted-foreground">Financial markets and business news</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                            <div>
                              <div className="font-medium text-sm">Ghana & African Stations</div>
                              <div className="text-xs text-muted-foreground">Joy FM, Citi FM, Peace FM and African networks</div>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2">
                          <p className="text-xs text-muted-foreground">
                            Access to 15+ premium radio stations including Joy FM Ghana, Citi FM, YFM, Capital FM Kenya, Metro FM South Africa, and major African networks.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="order-first lg:order-last">
                    <OnlineRadioPlayer />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Quick Start Guide</h2>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                    New to Das-AI? Here's how to get the most out of our podcast-first platform:
                  </p>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">1</div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-base sm:text-lg">Explore the Dashboard</h4>
                      <p className="text-sm text-muted-foreground">Get an overview of global economic indicators with podcast explanations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">2</div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-base sm:text-lg">Ask Specific Questions</h4>
                      <p className="text-sm text-muted-foreground">Use Ask Das-AI to generate custom podcast content for your queries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">3</div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-base sm:text-lg">Dive Deeper</h4>
                      <p className="text-sm text-muted-foreground">Explore specialized sections for detailed analysis and learning</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Popular Areas</CardTitle>
                    <CardDescription className="text-sm">Most accessed sections of the platform</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/dashboard" className="block">
                      <Button variant="ghost" className="w-full justify-start text-left h-auto py-3">
                        <BarChart2 className="mr-3 h-4 w-4 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium">Economic Dashboard</div>
                          <div className="text-xs text-muted-foreground">Real-time market data</div>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/personal-finance" className="block">
                      <Button variant="ghost" className="w-full justify-start text-left h-auto py-3">
                        <Scale className="mr-3 h-4 w-4 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium">Personal Finance</div>
                          <div className="text-xs text-muted-foreground">Investment & budgeting tools</div>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/savings" className="block">
                      <Button variant="ghost" className="w-full justify-start text-left h-auto py-3">
                        <Notebook className="mr-3 h-4 w-4 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium">Savings Analysis</div>
                          <div className="text-xs text-muted-foreground">Optimize your savings strategy</div>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/courses" className="block">
                      <Button variant="ghost" className="w-full justify-start text-left h-auto py-3">
                        <BookOpen className="mr-3 h-4 w-4 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium">Learning Courses</div>
                          <div className="text-xs text-muted-foreground">Structured economic education</div>
                        </div>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  Ready to Transform Your Economic Understanding?
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto">
                  Start your journey with podcast-first economic intelligence. Every page delivers content as engaging audio with interactive visuals.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/ask-das-ai" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
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
