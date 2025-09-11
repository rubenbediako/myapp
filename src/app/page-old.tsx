
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, BrainCircuit, MessageCircleQuestion, BookOpen, Loader2, Mic, Scale, Notebook, FileText, FileSignature, Building2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/hooks/use-ai';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const regions = ["Global", "Africa", "Asia", "Europe", "North America", "South America", "Oceania"];

interface BriefingResult {
    title: string;
    script: string;
    audioUrl?: string;
}

interface BriefingResult {
    title: string;
    script: string;
    audioUrl?: string;
}

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

  const features = [
    {
      icon: BrainCircuit,
      title: 'Core Analysis',
      description: 'Analyze macro variables, generate forecasts, and compare economies with powerful data visualizations and AI insights.',
      href: '/core-analysis/macroeconomics-variables',
      image: 'https://picsum.photos/600/401',
      dataAiHint: 'data chart'
    },
    {
      icon: MessageCircleQuestion,
      title: 'Ask Das-AI',
      description: 'Get custom podcast episodes and visuals in response to your complex questions on economics, business, and finance.',
      href: '/ask-das-ai',
      image: 'https://picsum.photos/600/402',
      dataAiHint: 'AI interface'
    },
    {
      icon: Building2,
      title: 'Entrepreneurship Hub',
      description: 'Generate comprehensive business plans, create professional proposals, and get AI-driven guidance for your venture.',
      href: '/entrepreneurship-hub',
      image: 'https://picsum.photos/600/403',
      dataAiHint: 'startup team'
    },
  ];

  return (
    <>
      <Head>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@1" async></script>
      </Head>
      <div className="flex-1 w-full bg-background text-foreground">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                        Unlock Global Economic Insights with Das-AI
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                        The Economist combines real-time data with powerful AI analysis to bring you economic intelligence like never before. Generate forecasts, compare economies, and even create your own podcasts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <Link href="/dashboard">
                            <Button size="lg" className="w-full sm:w-auto">
                                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/ask-das-ai">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                Ask a Question
                            </Button>
                        </Link>
                    </div>
                </div>
                <Image
                    src="https://picsum.photos/600/500"
                    width={600}
                    height={500}
                    alt="Manager in an office"
                    data-ai-hint="manager"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                />
            </div>
        </section>

        {/* Live Radio Section */}
        <section id="live-radio" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Live & On-Demand Audio</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tune In to Global Insights</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Listen to live news from leading global broadcasters or generate your own AI-powered daily briefing for a specific region.
                  </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12 max-w-7xl mx-auto">
                  <Card>
                      <CardHeader>
                          <CardTitle>BBC World Service — Live</CardTitle>
                          <CardDescription>Live news and analysis from the BBC (works worldwide).</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <audio src="http://stream.live.vc.bbcmedia.co.uk/bbc_world_service" controls preload="none" className='w-full'></audio>
                          <p className="text-sm text-muted-foreground mt-2">
                              Tip: You may need to click play once to satisfy your browser's autoplay rules. The stream might take a few moments to load.
                          </p>
                      </CardContent>
                  </Card>
                   <Card>
                      <CardHeader>
                          <CardTitle>Bloomberg Radio — Live</CardTitle>
                          <CardDescription>Live financial news and market analysis from Bloomberg.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <audio controls preload="none" src="https://playerservices.streamtheworld.com/api/livestream-redirect/WBBRAMAAC.aac" className='w-full'></audio>
                          <p className="text-sm text-muted-foreground mt-2">
                              If the stream stalls, the player will automatically attempt to reload it.
                          </p>
                      </CardContent>
                  </Card>
                  <Card className="flex flex-col">
                      <CardHeader>
                          <CardTitle>Das-AI Daily Briefing</CardTitle>
                          <CardDescription>Generate a podcast of today's top economic news.</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-1 justify-center items-center gap-4">
                           <div className="w-full space-y-2">
                                <Label htmlFor="region-select">Select Region</Label>
                                <Select onValueChange={setSelectedRegion} defaultValue="Global">
                                    <SelectTrigger id="region-select">
                                        <SelectValue placeholder="Select a region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                          <Button onClick={handleGenerateBriefing} disabled={!!loadingBriefing} className="w-full">
                              {loadingBriefing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic className="mr-2 h-4 w-4" />}
                              {loadingBriefing ? loadingBriefing : `Generate ${selectedRegion} Briefing`}
                          </Button>
                          {briefing && briefing.audioUrl && (
                            <div className='w-full space-y-2'>
                                <p className='text-sm font-medium text-center'>{briefing.title}</p>
                                <audio controls autoPlay src={briefing.audioUrl} className='w-full'>
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground text-center">
                              Das-AI will create a unique news summary for you. Generation may take a moment.
                          </p>
                      </CardContent>
                  </Card>
              </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 space-y-12">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Understand the Economy</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    From high-level analysis to specific questions, Das-AI provides the tools to explore economic data interactively.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card key={index} className="overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                            <Link href={feature.href} className="grid gap-1">
                                <Image
                                    src={feature.image}
                                    width={600}
                                    height={400}
                                    alt={feature.title}
                                    data-ai-hint={feature.dataAiHint}
                                    className="object-cover w-full h-48"
                                />
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <feature.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle>{feature.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </section>


         {/* Final CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="mx-auto px-4 md:px-6">
            <div className="grid items-center justify-center gap-4 text-center">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Dive In?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start analyzing, forecasting, and learning. Your journey into economic intelligence begins now.
                </p>
              </div>
              <div className="mt-6">
                 <Link href="/dashboard">
                    <Button size="lg">
                      Explore the Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
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
