'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, BarChart2, BrainCircuit, Radio, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DemoPage() {
  const [currentDemo, setCurrentDemo] = useState<string>('dashboard');
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSections = [
    {
      id: 'dashboard',
      title: 'Economic Dashboard',
      description: 'Real-time economic indicators and data visualization',
      icon: BarChart2,
      preview: '/dashboard'
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Ask complex economic questions and get instant analysis',
      icon: BrainCircuit,
      preview: '/ask-das-ai'
    },
    {
      id: 'radio',
      title: 'Live Radio Integration',
      description: 'Stay updated with BBC, Bloomberg, and African stations',
      icon: Radio,
      preview: '/#radio'
    },
    {
      id: 'analysis',
      title: 'Core Analysis Tools',
      description: 'Deep economic analysis and forecasting capabilities',
      icon: TrendingUp,
      preview: '/core-analysis'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Das-AI Platform Preview</h1>
                <p className="text-slate-600">Explore our key features and capabilities</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/dashboard">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Demo Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Interactive Demo</span>
                </CardTitle>
                <CardDescription>
                  Click on any section below to preview the feature
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {demoSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentDemo(section.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      currentDemo === section.id
                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <section.icon className={`w-5 h-5 mt-0.5 ${
                        currentDemo === section.id ? 'text-blue-600' : 'text-slate-500'
                      }`} />
                      <div>
                        <h3 className={`font-medium ${
                          currentDemo === section.id ? 'text-blue-900' : 'text-slate-900'
                        }`}>
                          {section.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Demo Preview */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {demoSections.find(s => s.id === currentDemo)?.title}
                    </CardTitle>
                    <CardDescription>
                      {demoSections.find(s => s.id === currentDemo)?.description}
                    </CardDescription>
                  </div>
                  <Button variant="outline" asChild>
                    <Link 
                      href={demoSections.find(s => s.id === currentDemo)?.preview || '/dashboard'}
                      target="_blank"
                    >
                      Open Live Version
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                      {(() => {
                        const currentSection = demoSections.find(s => s.id === currentDemo);
                        if (currentSection) {
                          const IconComponent = currentSection.icon;
                          return <IconComponent className="w-8 h-8 text-white" />;
                        }
                        return <Play className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        Interactive Preview
                      </h3>
                      <p className="text-slate-600 max-w-md mx-auto">
                        Click "Open Live Version" to interact with the actual {demoSections.find(s => s.id === currentDemo)?.title.toLowerCase()} feature.
                      </p>
                    </div>
                    <Button 
                      size="lg"
                      asChild
                      className="mt-6"
                    >
                      <Link href={demoSections.find(s => s.id === currentDemo)?.preview || '/dashboard'}>
                        Try {demoSections.find(s => s.id === currentDemo)?.title} Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose Das-AI?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the future of economic intelligence with our comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BrainCircuit className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get instant analysis of complex economic data with our advanced AI that understands context and provides actionable insights.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Radio className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Stay informed with live radio integration from BBC, Bloomberg, and leading African stations, plus real-time market data.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Comprehensive Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  From macroeconomic indicators to personal finance optimization, access all the tools you need in one platform.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Das-AI for their economic intelligence needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
