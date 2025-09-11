'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Globe, BarChart3, Activity } from 'lucide-react';

interface MarketData {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
}

const marketData: MarketData[] = [
  { name: 'S&P 500', value: '4,327.81', change: '+1.2%', isPositive: true, icon: TrendingUp },
  { name: 'NASDAQ', value: '13,281.76', change: '+0.8%', isPositive: true, icon: BarChart3 },
  { name: 'DOW', value: '34,323.05', change: '-0.3%', isPositive: false, icon: TrendingDown },
  { name: 'EUR/USD', value: '1.0875', change: '+0.15%', isPositive: true, icon: DollarSign },
  { name: 'Bitcoin', value: '$43,521', change: '+2.1%', isPositive: true, icon: Activity },
  { name: 'Gold', value: '$1,987.30', change: '-0.4%', isPositive: false, icon: Globe }
];

export function LiveMarketTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % marketData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Markets</span>
          </div>
          
          <div className="flex-1 mx-8">
            <div className="flex items-center justify-center animate-pulse">
              {marketData.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 px-4 transition-opacity duration-500 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${item.isPositive ? 'text-green-400' : 'text-red-400'}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm">{item.value}</span>
                  <span className={`text-sm font-medium ${item.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-slate-400">
            Live Data
          </div>
        </div>
      </div>
    </div>
  );
}

export function FloatingActionButtons() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <button
        onClick={scrollToTop}
        className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      >
        <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}

export function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-30"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
