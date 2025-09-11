'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Award, 
  Star, 
  Medal, 
  Target, 
  BookOpen, 
  Brain,
  Crown,
  Zap,
  Shield,
  Flame,
  Gem
} from 'lucide-react';

interface BadgeData {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'lesson' | 'course' | 'special';
  earnedAt?: string;
  score?: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon?: string;
  progress?: number;
  requirement?: string;
}

interface BadgeSystemProps {
  badges: BadgeData[];
  onBadgeClick?: (badge: BadgeData) => void;
  showProgress?: boolean;
}

const BADGE_ICONS = {
  quiz: Brain,
  lesson: BookOpen,
  course: Trophy,
  special: Crown
};

const BADGE_COLORS = {
  bronze: 'from-orange-300 to-orange-500',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-300 to-yellow-500',
  platinum: 'from-purple-300 to-purple-500'
};

const BADGE_BORDERS = {
  bronze: 'border-orange-400',
  silver: 'border-gray-400',
  gold: 'border-yellow-400',
  platinum: 'border-purple-400'
};

export function BadgeSystem({ badges, onBadgeClick, showProgress = true }: BadgeSystemProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  
  const earnedBadges = badges.filter(badge => badge.earnedAt);
  const availableBadges = badges.filter(badge => !badge.earnedAt);
  
  const totalProgress = badges.length > 0 ? (earnedBadges.length / badges.length) * 100 : 0;

  const handleBadgeClick = (badge: BadgeData) => {
    setSelectedBadge(badge);
    if (onBadgeClick) {
      onBadgeClick(badge);
    }
  };

  const BadgeItem = ({ badge, earned = false }: { badge: BadgeData; earned?: boolean }) => {
    const IconComponent = BADGE_ICONS[badge.type];
    const isEarned = !!badge.earnedAt;
    
    return (
      <Card 
        className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
          isEarned 
            ? `bg-gradient-to-br ${BADGE_COLORS[badge.level]} ${BADGE_BORDERS[badge.level]} border-2` 
            : 'bg-gray-100 border-gray-200 opacity-60'
        }`}
        onClick={() => handleBadgeClick(badge)}
      >
        <CardContent className="p-4 text-center">
          <div className="relative mb-3">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              isEarned 
                ? `bg-white/20 ${badge.level === 'gold' ? 'text-yellow-800' : badge.level === 'silver' ? 'text-gray-800' : badge.level === 'bronze' ? 'text-orange-800' : 'text-purple-800'}`
                : 'bg-gray-200 text-gray-400'
            }`}>
              <IconComponent className="h-8 w-8" />
            </div>
            {isEarned && (
              <div className="absolute -top-1 -right-1">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="h-3 w-3 text-white fill-current" />
                </div>
              </div>
            )}
          </div>
          
          <h3 className={`font-semibold text-sm mb-1 ${
            isEarned ? 'text-white' : 'text-gray-600'
          }`}>
            {badge.title}
          </h3>
          
          <p className={`text-xs mb-2 ${
            isEarned ? 'text-white/80' : 'text-gray-500'
          }`}>
            {badge.description}
          </p>
          
          <div className="flex justify-center">
            <Badge 
              variant={isEarned ? "secondary" : "outline"}
              className={`text-xs ${
                isEarned 
                  ? 'bg-white/20 text-white border-white/30' 
                  : 'text-gray-500'
              }`}
            >
              {badge.level.toUpperCase()}
            </Badge>
          </div>
          
          {badge.score && isEarned && (
            <div className="mt-2 text-xs text-white/80">
              Score: {badge.score}%
            </div>
          )}
          
          {badge.earnedAt && (
            <div className="mt-1 text-xs text-white/60">
              {new Date(badge.earnedAt).toLocaleDateString()}
            </div>
          )}
          
          {!isEarned && badge.progress && (
            <div className="mt-2">
              <Progress value={badge.progress} className="h-1" />
              <div className="text-xs text-gray-500 mt-1">
                {badge.progress}% complete
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      {showProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Badge Progress
            </CardTitle>
            <CardDescription>
              Earn badges by completing quizzes, lessons, and courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {earnedBadges.length}
                </div>
                <div className="text-sm text-gray-600">Earned</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {availableBadges.length}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {badges.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(totalProgress)}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{earnedBadges.length}/{badges.length} badges</span>
              </div>
              <Progress value={totalProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Medal className="h-5 w-5 text-yellow-500" />
            Earned Badges ({earnedBadges.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map(badge => (
              <BadgeItem key={badge.id} badge={badge} earned={true} />
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-gray-500" />
            Available Badges ({availableBadges.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableBadges.map(badge => (
              <BadgeItem key={badge.id} badge={badge} earned={false} />
            ))}
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                selectedBadge.earnedAt 
                  ? `bg-gradient-to-br ${BADGE_COLORS[selectedBadge.level]}` 
                  : 'bg-gray-200'
              }`}>
                {React.createElement(BADGE_ICONS[selectedBadge.type], {
                  className: `h-10 w-10 ${
                    selectedBadge.earnedAt ? 'text-white' : 'text-gray-400'
                  }`
                })}
              </div>
              <CardTitle className="text-xl">{selectedBadge.title}</CardTitle>
              <CardDescription>{selectedBadge.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Badge className={`${BADGE_COLORS[selectedBadge.level]} text-white border-0`}>
                  {selectedBadge.level.toUpperCase()} LEVEL
                </Badge>
              </div>
              
              {selectedBadge.earnedAt ? (
                <div className="text-center space-y-2">
                  <div className="text-green-600 font-medium">✓ Badge Earned!</div>
                  <div className="text-sm text-gray-600">
                    Earned on {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                  </div>
                  {selectedBadge.score && (
                    <div className="text-sm">
                      Achievement Score: <span className="font-medium">{selectedBadge.score}%</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="text-gray-600">Requirements:</div>
                  <div className="text-sm text-gray-500">
                    {selectedBadge.requirement || 'Complete the associated quiz or lesson'}
                  </div>
                  {selectedBadge.progress && (
                    <div className="space-y-2">
                      <Progress value={selectedBadge.progress} />
                      <div className="text-sm text-gray-500">
                        {selectedBadge.progress}% complete
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <Button 
                onClick={() => setSelectedBadge(null)} 
                className="w-full"
                variant="outline"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
