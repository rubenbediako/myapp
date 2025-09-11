'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Play, 
  TrendingUp, 
  Zap, 
  Users, 
  Star, 
  CheckCircle, 
  BarChart3, 
  Brain, 
  Mic, 
  Radio,
  Globe,
  Award,
  BookOpen,
  MessageCircle,
  Sparkles,
  Target,
  Shield,
  Clock,
  Headphones,
  LineChart,
  PieChart,
  Calculator,
  Building,
  DollarSign,
  TrendingDown,
  Volume2,
  ChevronRight,
  ExternalLink,
  Download,
  Share2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';
import { OnlineRadioPlayer } from '@/components/online-radio-player';
import { LiveMarketTicker, FloatingActionButtons, ParallaxBackground } from '@/components/modern-landing-components';
import { AnimatedHeroSection } from '@/components/animated-hero-section';

// Animation variants for framer-motion-like effects using CSS
const fadeInUp = "animate-[fadeInUp_0.6s_ease-out_forwards]";
const fadeInLeft = "animate-[fadeInLeft_0.8s_ease-out_forwards]";
const fadeInRight = "animate-[fadeInRight_0.8s_ease-out_forwards]";
const scaleIn = "animate-[scaleIn_0.5s_ease-out_forwards]";
const slideInBottom = "animate-[slideInBottom_0.7s_ease-out_forwards]";

export default function ModernLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "1M+", label: "Podcasts Generated", icon: Headphones },
    { number: "95%", label: "User Satisfaction", icon: Star },
    { number: "24/7", label: "Live Radio", icon: Radio }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Economics",
      description: "Transform complex economic data into engaging, personalized podcast content with visual analytics.",
      color: "from-blue-500 to-cyan-500",
      demo: "Ask about GDP trends"
    },
    {
      icon: Radio,
      title: "Live Global Radio",
      description: "Stream BBC, Bloomberg, and 15+ international stations while you learn and explore.",
      color: "from-purple-500 to-pink-500",
      demo: "Listen to BBC World Service"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Interactive charts, forecasting models, and comparative analysis across global markets.",
      color: "from-green-500 to-emerald-500",
      demo: "View market analysis"
    },
    {
      icon: Award,
      title: "Gamified Learning",
      description: "Earn badges, take quizzes, and get certified with our interactive learning system.",
      color: "from-orange-500 to-red-500",
      demo: "Start a course"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Economics Professor",
      avatar: "👩‍🏫",
      quote: "Das-AI has revolutionized how I teach economics. Students are more engaged with podcast-based learning.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Financial Analyst",
      avatar: "👨‍💼",
      quote: "The real-time data analysis and AI insights have significantly improved my market predictions.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Business Student",
      avatar: "👩‍🎓",
      quote: "Learning economics through podcasts and interactive content makes complex concepts so much easier to understand.",
      rating: 5
    }
  ];

  const podcastContent = `
    Welcome to Das-AI - The Future of Economic Intelligence

    Discover how artificial intelligence transforms complex economic data into engaging, accessible content. Our platform combines cutting-edge AI with intuitive design to make economics education and analysis more effective than ever before.

    Key Features:
    • Interactive podcast generation from any economic query
    • Real-time global economic data visualization
    • Live radio integration from trusted sources worldwide
    • Gamified learning with badges and certificates
    • Professional-grade analytics and forecasting tools

    Whether you're a student, educator, or professional, Das-AI provides the tools you need to understand and analyze the global economy through immersive audio and visual experiences.
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
    title: 'Platform Demo'
  };

  return (
    <div className="min-h-screen">
      <ParallaxBackground />
      
      {/* Live Market Ticker */}
      <LiveMarketTicker />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-white/20 z-50" style={{ top: '32px' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Das-AI
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-1">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/ask-das-ai" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>Ask AI</span>
              </Link>
              <Link href="/core-analysis" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-1">
                <LineChart className="w-4 h-4" />
                <span>Analysis</span>
              </Link>
              <Link href="/personal-finance" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-1">
                <Calculator className="w-4 h-4" />
                <span>Finance</span>
              </Link>
              <Link href="/entrepreneurship-hub" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-1">
                <Building className="w-4 h-4" />
                <span>Business</span>
              </Link>
              <Link href="/courses" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>Courses</span>
              </Link>
              <Link href="/savings" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-1">
                <PieChart className="w-4 h-4" />
                <span>Savings</span>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="sm">Features</Button>
              </Link>
              <Link href="/courses">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`bg-slate-600 block h-0.5 w-6 rounded-sm transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                  <span className={`bg-slate-600 block h-0.5 w-6 rounded-sm transition-all ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`bg-slate-600 block h-0.5 w-6 rounded-sm transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
                </div>
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-white/20">
              <div className="flex flex-col space-y-3">
                <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-2 py-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/ask-das-ai" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-2 py-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask AI</span>
                </Link>
                <Link href="/core-analysis" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-2 py-2">
                  <LineChart className="w-4 h-4" />
                  <span>Analysis</span>
                </Link>
                <Link href="/personal-finance" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-2 py-2">
                  <Calculator className="w-4 h-4" />
                  <span>Finance</span>
                </Link>
                <Link href="/entrepreneurship-hub" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-2 py-2">
                  <Building className="w-4 h-4" />
                  <span>Business</span>
                </Link>
                <Link href="/courses" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-2 py-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Courses</span>
                </Link>
                <Link href="/savings" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-2 py-2">
                  <PieChart className="w-4 h-4" />
                  <span>Savings</span>
                </Link>
                <div className="pt-2 border-t border-white/20">
                  <Link href="/courses">
                    <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Animated Hero Section */}
      <AnimatedHeroSection />

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Core Features</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                Everything You Need for
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Economic Intelligence
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              From AI-generated podcasts to live radio streaming, our platform provides comprehensive tools for economic learning and analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`group hover:scale-105 transition-all duration-300 cursor-pointer bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl ${
                  activeFeature === index ? 'ring-2 ring-blue-500/50' : ''
                } ${isVisible ? scaleIn : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setActiveFeature(index)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50">
                    {feature.demo}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Showcase */}
          <div className="mt-20">
            <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Interactive Learning Experience</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      Our platform transforms traditional economics education through interactive podcasts, 
                      real-time data visualization, and gamified learning experiences.
                    </p>
                    <div className="space-y-3">
                      {[
                        "AI-generated personalized content",
                        "Real-time global economic data",
                        "Interactive quizzes and badges", 
                        "Live radio from trusted sources"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white/70 dark:bg-slate-800/70">
                      <CardContent className="p-4 text-center">
                        <Headphones className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <div className="font-semibold">Podcasts</div>
                        <div className="text-sm text-slate-600">AI Generated</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/70 dark:bg-slate-800/70">
                      <CardContent className="p-4 text-center">
                        <LineChart className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <div className="font-semibold">Analytics</div>
                        <div className="text-sm text-slate-600">Real-time Data</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/70 dark:bg-slate-800/70">
                      <CardContent className="p-4 text-center">
                        <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <div className="font-semibold">Certificates</div>
                        <div className="text-sm text-slate-600">Earn & Share</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/70 dark:bg-slate-800/70">
                      <CardContent className="p-4 text-center">
                        <Radio className="w-8 h-8 mx-auto mb-2 text-red-600" />
                        <div className="font-semibold">Live Radio</div>
                        <div className="text-sm text-slate-600">Global Stations</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Live Demo</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              See Das-AI in Action
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Experience the power of AI-driven economics education and real-time data analysis.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* AI Assistant Demo */}
            <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Ask Das-AI Anything
                </CardTitle>
                <CardDescription>
                  Get instant podcast explanations for any economic concept
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white/70 dark:bg-slate-900/70 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">User Question</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          "Explain the relationship between inflation and unemployment with current examples"
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">Das-AI Response</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          Generates personalized podcast with charts, equations, and real-world examples...
                        </div>
                        <Button size="sm" variant="outline">
                          <Play className="w-4 h-4 mr-1" />
                          Play Generated Podcast
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>Jump into key platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/ask-das-ai">
                  <Button variant="ghost" className="w-full justify-start">
                    <Brain className="w-4 h-4 mr-2" />
                    Ask AI Assistant
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Learning
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start">
                  <Radio className="w-4 h-4 mr-2" />
                  Listen to Radio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Loved by Educators & Professionals
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              See what our users are saying about Das-AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-slate-600 dark:text-slate-300 mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Economic Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students, educators, and professionals who are already using Das-AI to make economics more engaging and accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-100">
                <BookOpen className="w-5 h-5 mr-2" />
                Start Learning Now
              </Button>
            </Link>
            <Link href="/ask-das-ai">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageCircle className="w-5 h-5 mr-2" />
                Try AI Assistant
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <BarChart3 className="w-5 h-5 mr-2" />
                Explore Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm text-blue-100">
            <Link href="/personal-finance" className="hover:text-white transition-colors flex items-center gap-1">
              <Calculator className="w-4 h-4" />
              Personal Finance
            </Link>
            <Link href="/savings" className="hover:text-white transition-colors flex items-center gap-1">
              <PieChart className="w-4 h-4" />
              Savings Analysis
            </Link>
            <Link href="/entrepreneurship-hub" className="hover:text-white transition-colors flex items-center gap-1">
              <Building className="w-4 h-4" />
              Business Hub
            </Link>
            <Link href="/core-analysis" className="hover:text-white transition-colors flex items-center gap-1">
              <LineChart className="w-4 h-4" />
              Core Analysis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Das-AI</span>
              </div>
              <p className="text-slate-400 mb-4">
                Transform economics education through AI-powered podcasts and interactive learning experiences.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-slate-400 hover:text-white transition-colors">Economic Dashboard</Link>
                <Link href="/ask-das-ai" className="block text-slate-400 hover:text-white transition-colors">Ask Das-AI</Link>
                <Link href="/core-analysis" className="block text-slate-400 hover:text-white transition-colors">Core Analysis</Link>
                <Link href="/core-analysis/macroeconomics-variables" className="block text-slate-400 hover:text-white transition-colors">Macro Variables</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Finance & Business</h3>
              <div className="space-y-2">
                <Link href="/personal-finance" className="block text-slate-400 hover:text-white transition-colors">Personal Finance</Link>
                <Link href="/savings" className="block text-slate-400 hover:text-white transition-colors">Savings Analysis</Link>
                <Link href="/entrepreneurship-hub" className="block text-slate-400 hover:text-white transition-colors">Business Hub</Link>
                <Link href="/capital-market" className="block text-slate-400 hover:text-white transition-colors">Capital Market</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Learning & Media</h3>
              <div className="space-y-2">
                <Link href="/courses" className="block text-slate-400 hover:text-white transition-colors">Learning Courses</Link>
                <Link href="/consumption" className="block text-slate-400 hover:text-white transition-colors">Consumption Analysis</Link>
                <Link href="/employment-unemployment" className="block text-slate-400 hover:text-white transition-colors">Employment Data</Link>
                <Link href="/budget" className="block text-slate-400 hover:text-white transition-colors">Budget Planning</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <div className="space-y-2">
                <div className="text-slate-400">Live Radio Streaming</div>
                <div className="text-slate-400">AI Podcast Generation</div>
                <div className="text-slate-400">Interactive Analytics</div>
                <div className="text-slate-400">Gamified Learning</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Das-AI. All rights reserved. Built with AI for the future of economics education.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
