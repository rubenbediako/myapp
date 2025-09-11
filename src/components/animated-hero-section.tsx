'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Volume2, 
  Brain, 
  Radio, 
  TrendingUp, 
  Zap,
  BarChart3,
  Globe,
  Users,
  Star
} from 'lucide-react';
import Link from 'next/link';

export function AnimatedHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const floatingElements = [
    { icon: Brain, color: 'text-blue-500', delay: '0s', size: 'w-8 h-8' },
    { icon: Radio, color: 'text-purple-500', delay: '0.5s', size: 'w-6 h-6' },
    { icon: BarChart3, color: 'text-green-500', delay: '1s', size: 'w-7 h-7' },
    { icon: Globe, color: 'text-cyan-500', delay: '1.5s', size: 'w-5 h-5' },
    { icon: TrendingUp, color: 'text-orange-500', delay: '2s', size: 'w-6 h-6' },
    { icon: Zap, color: 'text-yellow-500', delay: '2.5s', size: 'w-5 h-5' }
  ];

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950"
    >
      {/* Interactive Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`
          }}
        />
      </div>

      {/* Floating Icons */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`absolute animate-float ${element.color}`}
          style={{
            left: `${20 + (index * 15)}%`,
            top: `${30 + (index % 3) * 20}%`,
            animationDelay: element.delay,
            animationDuration: `${3 + (index % 3)}s`
          }}
        >
          <element.icon className={element.size} />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className={`mb-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Badge className="inline-flex items-center gap-2 px-6 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-white/20 text-blue-700 hover:bg-white/90">
              <Sparkles className="w-4 h-4" />
              AI-Powered Economics Platform
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className={`text-4xl md:text-7xl font-bold leading-tight mb-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
              Transform Economics Into
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent relative">
              Interactive Experiences
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-12 max-w-3xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            Generate personalized economic podcasts, access live global radio, and explore interactive analytics. 
            Make complex economic concepts engaging and accessible through AI-powered content.
          </p>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <Link href="/ask-das-ai">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Try AI Assistant
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-white/20 hover:bg-white/90 shadow-lg">
              <Volume2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Cards */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
            {[
              { icon: Users, number: "50K+", label: "Users", color: "from-blue-500 to-cyan-500" },
              { icon: Radio, number: "15+", label: "Radio Stations", color: "from-purple-500 to-pink-500" },
              { icon: Star, number: "95%", label: "Satisfaction", color: "from-green-500 to-emerald-500" },
              { icon: Brain, number: "AI", label: "Powered", color: "from-orange-500 to-red-500" }
            ].map((stat, index) => (
              <Card key={index} className="group hover:scale-105 transition-all duration-300 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">{stat.number}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 dark:border-slate-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 dark:bg-slate-600 rounded-full mt-2 animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
