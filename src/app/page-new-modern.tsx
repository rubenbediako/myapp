'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, BrainCircuit, MessageCircleQuestion, BookOpen, Radio, TrendingUp, Shield, Building2, GraduationCap, PiggyBank, Calculator, Users, Globe, Menu, X, ChevronDown, Play, Star, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnlineRadioPlayer } from '@/components/online-radio-player';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [stats, setStats] = useState({ users: 0, analyses: 0, savings: 0 });

  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        users: Math.min(prev.users + 47, 15000),
        analyses: Math.min(prev.analyses + 23, 50000),
        savings: Math.min(prev.savings + 89, 2500000)
      }));
    }, 50);
    
    setTimeout(() => clearInterval(interval), 3000);
    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: BarChart2
    },
    {
      label: 'AI Assistant',
      href: '/ask-das-ai', 
      icon: BrainCircuit
    },
    {
      label: 'Analysis',
      icon: TrendingUp,
      dropdown: [
        { label: 'Core Economic Analysis', href: '/core-analysis' },
        { label: 'Macroeconomic Variables', href: '/core-analysis/macroeconomics-variables' },
        { label: 'Employment & Unemployment', href: '/employment-unemployment' },
        { label: 'Capital Markets', href: '/capital-market' },
        { label: 'Consumption Analysis', href: '/consumption' },
        { label: 'Investment Analysis', href: '/investment' },
        { label: 'Wages Analysis', href: '/wages' }
      ]
    },
    {
      label: 'Finance',
      icon: PiggyBank,
      dropdown: [
        { label: 'Personal Finance', href: '/personal-finance' },
        { label: 'Savings Optimizer', href: '/savings' },
        { label: 'Budget Planner', href: '/budget' },
        { label: 'Security & Risk', href: '/security-risk' }
      ]
    },
    {
      label: 'Business',
      icon: Building2,
      dropdown: [
        { label: 'Entrepreneurship Hub', href: '/entrepreneurship-hub' },
        { label: 'Business Planning', href: '/entrepreneurship-hub' },
        { label: 'Market Analysis', href: '/capital-market' }
      ]
    },
    {
      label: 'Education',
      icon: GraduationCap,
      dropdown: [
        { label: 'Courses', href: '/courses' },
        { label: 'Learning Paths', href: '/courses' },
        { label: 'About Us', href: '/about' }
      ]
    }
  ];

  const features = [
    {
      icon: BrainCircuit,
      title: 'AI-Powered Analysis',
      description: 'Get instant insights on complex economic data with our advanced AI assistant. Ask questions in natural language and receive comprehensive analysis.',
      href: '/ask-das-ai'
    },
    {
      icon: Radio,
      title: 'Live Radio Integration',
      description: 'Stay updated with real-time news from BBC World, Bloomberg, and Ghana & African stations. Never miss important market updates.',
      href: '#radio'
    },
    {
      icon: BarChart2,
      title: 'Advanced Analytics',
      description: 'Comprehensive economic analysis tools with real-time data visualization, forecasting, and interactive dashboards.',
      href: '/core-analysis'
    },
    {
      icon: GraduationCap,
      title: 'Gamified Learning',
      description: 'Learn economics through interactive courses, challenges, and real-world case studies designed for all skill levels.',
      href: '/courses'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Das-AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.dropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {activeDropdown === item.label && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <div>
                        <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-700">
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              className="block px-3 py-2 text-sm text-slate-600 hover:text-blue-600"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href!}
                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 px-3 space-y-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-600">Live Radio & Analysis</span>
                  </div>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Economic Intelligence
                  <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Powered by AI
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Transform complex economic data into actionable insights. From real-time analysis to personal finance optimization, Das-AI makes economics accessible for everyone.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-4" asChild>
                  <Link href="/dashboard">
                    Start Analyzing
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                  <Link href="/ask-das-ai">
                    <MessageCircleQuestion className="w-5 h-5 mr-2" />
                    Ask Das-AI
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>15,000+ Users</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Enterprise Security</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Real-time Dashboard</h3>
                    <p className="text-sm text-slate-600">Live economic indicators</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">GDP Growth</span>
                    <span className="text-green-600 font-semibold">+3.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Inflation Rate</span>
                    <span className="text-blue-600 font-semibold">2.1%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Unemployment</span>
                    <span className="text-purple-600 font-semibold">4.8%</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">{stats.users.toLocaleString()}+</div>
              <div className="text-slate-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">{stats.analyses.toLocaleString()}+</div>
              <div className="text-slate-600">Analyses Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">${stats.savings.toLocaleString()}+</div>
              <div className="text-slate-600">Savings Optimized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Everything you need for economic intelligence
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From AI-powered analysis to live radio integration, our platform provides comprehensive tools for understanding and navigating the economic landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-600 mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={feature.href}>
                      Explore
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Radio Section */}
      <section id="radio" className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay Connected with Live Radio
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Get real-time updates from BBC World, Bloomberg Radio, and leading Ghana & African stations. Never miss important economic news and market movements.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8">
            <OnlineRadioPlayer />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to transform your economic understanding?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals, students, and enthusiasts who trust Das-AI for their economic intelligence needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
              <Link href="/dashboard">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/ask-das-ai">
                Try AI Assistant
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Das-AI</span>
              </div>
              <p className="text-slate-400">
                Transforming economic intelligence through AI-powered analysis and interactive learning.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform Tools</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-slate-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/ask-das-ai" className="block text-slate-400 hover:text-white transition-colors">
                  AI Assistant
                </Link>
                <Link href="/core-analysis" className="block text-slate-400 hover:text-white transition-colors">
                  Core Analysis
                </Link>
                <Link href="/personal-finance" className="block text-slate-400 hover:text-white transition-colors">
                  Personal Finance
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Business Tools</h3>
              <div className="space-y-2">
                <Link href="/entrepreneurship-hub" className="block text-slate-400 hover:text-white transition-colors">
                  Entrepreneurship Hub
                </Link>
                <Link href="/capital-market" className="block text-slate-400 hover:text-white transition-colors">
                  Capital Markets
                </Link>
                <Link href="/investment" className="block text-slate-400 hover:text-white transition-colors">
                  Investment Analysis
                </Link>
                <Link href="/security-risk" className="block text-slate-400 hover:text-white transition-colors">
                  Security & Risk
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Learning</h3>
              <div className="space-y-2">
                <Link href="/courses" className="block text-slate-400 hover:text-white transition-colors">
                  Courses
                </Link>
                <Link href="/about" className="block text-slate-400 hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="/savings" className="block text-slate-400 hover:text-white transition-colors">
                  Savings Tools
                </Link>
                <Link href="/budget" className="block text-slate-400 hover:text-white transition-colors">
                  Budget Planner
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                © 2024 Das-AI. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link href="/support" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
