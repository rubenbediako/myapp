'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  ArrowLeft, 
  Play, 
  Download, 
  Volume2, 
  BookOpen, 
  Calculator, 
  BarChart3, 
  TrendingUp, 
  LineChart,
  Loader2,
  Mic,
  Square,
  ImageIcon,
  HelpCircle,
  Trophy,
  Award,
  Brain,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { usePodcastAudio } from '@/hooks/use-podcast-audio';
import { BarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InteractiveQuiz } from '@/components/interactive-quiz';
import { BadgeSystem } from '@/components/badge-system';
import { CertificateGenerator } from '@/components/certificate-generator';
import { quizQuestions, courseBadgeTemplates } from '@/data/quiz-questions';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Course curriculum data
const courseCurriculum = {
  'microeconomics': {
    title: 'Microeconomics',
    description: 'Understand the behavior of individuals and firms in making decisions regarding the allocation of scarce resources.',
    modules: [
      { id: 1, title: 'Introduction to Microeconomics', completed: false, topic: 'basics of microeconomics, supply and demand fundamentals' },
      { id: 2, title: 'Supply and Demand', completed: false, topic: 'supply and demand curves, market equilibrium, elasticity' },
      { id: 3, title: 'Consumer Theory', completed: false, topic: 'utility functions, indifference curves, budget constraints' },
      { id: 4, title: 'Producer Theory', completed: false, topic: 'production functions, cost curves, profit maximization' },
      { id: 5, title: 'Market Structures', completed: false, topic: 'perfect competition, monopoly, oligopoly, market failures' },
    ]
  },
  'macroeconomics': {
    title: 'Macroeconomics',
    description: 'Analyze the performance, structure, behavior, and decision-making of an economy as a whole.',
    modules: [
      { id: 1, title: 'Introduction to Macroeconomics', completed: false, topic: 'GDP, inflation, unemployment, business cycles' },
      { id: 2, title: 'Economic Growth Models', completed: false, topic: 'Solow growth model, endogenous growth theory' },
      { id: 3, title: 'Monetary Policy', completed: false, topic: 'central banking, interest rates, money supply' },
      { id: 4, title: 'Fiscal Policy', completed: false, topic: 'government spending, taxation, fiscal multipliers' },
      { id: 5, title: 'International Economics', completed: false, topic: 'exchange rates, trade balance, international finance' },
    ]
  },
  'entrepreneurship': {
    title: 'Entrepreneurship',
    description: 'Learn the process of designing, launching, and running a new business.',
    modules: [
      { id: 1, title: 'Entrepreneurial Mindset', completed: false, topic: 'innovation, opportunity recognition, risk management' },
      { id: 2, title: 'Business Planning', completed: false, topic: 'business models, market analysis, financial projections' },
      { id: 3, title: 'Funding and Finance', completed: false, topic: 'venture capital, angel investors, crowdfunding' },
      { id: 4, title: 'Marketing and Sales', completed: false, topic: 'customer acquisition, digital marketing, sales strategies' },
      { id: 5, title: 'Operations and Growth', completed: false, topic: 'scaling operations, team building, exit strategies' },
    ]
  },
  'international-trade': {
    title: 'International Trade',
    description: 'Explore the exchange of capital, goods, and services across international borders.',
    modules: [
      { id: 1, title: 'Trade Theory', completed: false, topic: 'comparative advantage, Heckscher-Ohlin model, trade patterns' },
      { id: 2, title: 'Trade Policy', completed: false, topic: 'tariffs, quotas, trade agreements, WTO' },
      { id: 3, title: 'Exchange Rates', completed: false, topic: 'currency markets, exchange rate determination, purchasing power parity' },
      { id: 4, title: 'International Finance', completed: false, topic: 'balance of payments, capital flows, financial crises' },
      { id: 5, title: 'Globalization', completed: false, topic: 'multinational corporations, global value chains, trade disputes' },
    ]
  },
  'banking-and-finance': {
    title: 'Banking and Finance',
    description: 'Study of money, banking, credit, investments, and financial markets.',
    modules: [
      { id: 1, title: 'Financial Systems', completed: false, topic: 'financial institutions, money markets, capital markets' },
      { id: 2, title: 'Banking Operations', completed: false, topic: 'commercial banking, investment banking, risk management' },
      { id: 3, title: 'Investment Analysis', completed: false, topic: 'portfolio theory, asset pricing, market efficiency' },
      { id: 4, title: 'Corporate Finance', completed: false, topic: 'capital structure, dividend policy, mergers and acquisitions' },
      { id: 5, title: 'Financial Regulation', completed: false, topic: 'banking regulation, financial stability, monetary policy' },
    ]
  }
};

interface PodcastLine {
  speaker: "Speaker1" | "Speaker2";
  line: string;
}

interface UserProgress {
  completedModules: number[];
  earnedBadges: any[];
  quizResults: Record<string, any>;
  courseCompleted: boolean;
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const courseId = params.courseId as string;
  const course = courseCurriculum[courseId as keyof typeof courseCurriculum];
  
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ podcastScript: PodcastLine[] } | null>(null);
  const [usePremiumAudio, setUsePremiumAudio] = useState(true);
  
  // Learning progression states
  const [showQuiz, setShowQuiz] = useState(false);
  const [showBadgeSystem, setShowBadgeSystem] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedModules: [],
    earnedBadges: [],
    quizResults: {},
    courseCompleted: false
  });
  
  // Podcast audio functionality
  const {
    isGenerating: isGeneratingAudio,
    isPlaying: isPlayingAudio,
    currentSegment,
    audioUrl,
    progress: audioProgress,
    visualContent,
    isGeneratingVisuals,
    generateAudio,
    playAudio,
    stopAudio,
    stopGeneration,
    downloadAudio
  } = usePodcastAudio({
    onComplete: () => {
      toast({
        title: "Lesson Complete!",
        description: "Your lesson podcast is ready with educational content.",
      });
    },
    onError: (error) => {
      toast({
        title: "Lesson Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
  }, [user, router]);

  if (!course) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Course Not Found</h1>
          <Button onClick={() => router.push('/courses')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const handleStartModule = (module: any) => {
    setSelectedModule(module.id);
    setQuery(`Teach me about ${module.topic} in ${course.title}. Include mathematical equations, practical examples, and real-world applications.`);
  };

  const generatePodcastLesson = async () => {
    if (!query.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/ask-das-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        
        // Generate audio and visual content
        if (data.podcastScript) {
          await generateAudio(data.podcastScript, query, usePremiumAudio);
        }
        
        // Mark lesson as completed and show quiz option
        setLessonCompleted(true);
      } else {
        throw new Error('Failed to generate lesson');
      }
    } catch (error) {
      console.error('Error generating lesson:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate the lesson. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizComplete = (result: any) => {
    const moduleId = selectedModule;
    if (!moduleId) return;

    // Save quiz result
    setUserProgress(prev => ({
      ...prev,
      quizResults: {
        ...prev.quizResults,
        [`${courseId}-module-${moduleId}`]: result
      }
    }));

    if (result.passed) {
      // Mark module as completed
      setUserProgress(prev => ({
        ...prev,
        completedModules: [...prev.completedModules, moduleId]
      }));

      // Show badge system
      setShowBadgeSystem(true);
      setShowQuiz(false);

      toast({
        title: "Module Completed! 🎉",
        description: `You passed with ${result.percentage}%! Your badge has been earned.`,
      });

      // Check if course is completed
      const totalModules = course.modules.length;
      const completedCount = userProgress.completedModules.length + 1; // +1 for current module
      if (completedCount >= totalModules) {
        setUserProgress(prev => ({ ...prev, courseCompleted: true }));
        setShowCertificate(true);
        
        toast({
          title: "Course Completed! 🏆",
          description: "Congratulations! You've completed the entire course. Download your certificate!",
        });
      }
    } else {
      toast({
        title: "Quiz Failed",
        description: `You scored ${result.percentage}%. You need 70% to pass. Try again!`,
        variant: "destructive"
      });
    }
  };

  const handleBadgeEarned = (badge: any) => {
    setUserProgress(prev => ({
      ...prev,
      earnedBadges: [...prev.earnedBadges, badge]
    }));

    toast({
      title: "Badge Earned! 🏅",
      description: `You've earned the ${badge.name} badge!`,
    });
  };

  const startQuiz = () => {
    if (!selectedModule || !lessonCompleted) {
      toast({
        title: "Complete the lesson first",
        description: "You need to complete the lesson before taking the quiz.",
        variant: "destructive"
      });
      return;
    }
    setShowQuiz(true);
  };

  const completedModules = userProgress.completedModules.length;
  const totalModules = course.modules.length;
  const progressPercentage = (completedModules / totalModules) * 100;

  // Get quiz questions for current course and module
  const getCurrentQuizQuestions = () => {
    if (!selectedModule) return [];
    const courseQuestions = quizQuestions[courseId as keyof typeof quizQuestions];
    if (!courseQuestions) return [];
    return courseQuestions[`module${selectedModule}` as keyof typeof courseQuestions] || [];
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/courses')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">{course.title}</h1>
          </div>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Course Progress
            <Badge variant="outline">
              {completedModules}/{totalModules} Modules
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {progressPercentage.toFixed(0)}% Complete
          </p>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Course Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Modules
            </CardTitle>
            <CardDescription>
              Select a module to start your AI-powered lesson
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {course.modules.map((module) => {
              const isCompleted = userProgress.completedModules.includes(module.id);
              const isSelected = selectedModule === module.id;
              
              return (
                <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {module.title}
                      {isCompleted && <Trophy className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div className="text-sm text-muted-foreground">{module.topic}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <Badge variant="default">Completed</Badge>
                    )}
                    {isSelected && lessonCompleted && !isCompleted && (
                      <Badge variant="secondary">Lesson Ready</Badge>
                    )}
                    <Button 
                      onClick={() => handleStartModule(module)}
                      disabled={isGenerating || isGeneratingAudio}
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                    >
                      {isSelected ? 'Selected' : isCompleted ? 'Review' : 'Start'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* AI Lesson Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              AI Lesson Generator
            </CardTitle>
            <CardDescription>
              Generate personalized lessons with mathematical content and visualizations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What would you like to learn? (e.g., Explain supply and demand with mathematical equations and graphs)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
            />
            
            {/* Premium Audio Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="premium-audio-course" 
                  checked={usePremiumAudio}
                  onCheckedChange={(checked) => setUsePremiumAudio(checked as boolean)}
                />                            <label 
                                htmlFor="premium-audio-course" 
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Use Premium Voice for Lessons (ElevenLabs)
                            </label>
                            <Badge variant="outline" className="text-xs">
                                Recommended
                            </Badge>
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <div className="space-y-2">
                      <p className="font-medium">Premium Educational Audio</p>
                      <p className="text-xs">Advanced AI content with professional voice quality.</p>
                      <p className="text-xs">ElevenLabs premium voices for educational content.</p>
                      <p className="text-xs">Google Gemini generates educational content.</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Button 
              onClick={generatePodcastLesson}
              disabled={!query.trim() || isGenerating || isGeneratingAudio}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Lesson...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Generate AI Lesson
                </>
              )}
            </Button>

            {/* Quiz Button - Show after lesson completion */}
            {lessonCompleted && selectedModule && !userProgress.completedModules.includes(selectedModule) && (
              <Button 
                onClick={startQuiz}
                className="w-full"
                variant="secondary"
              >
                <Brain className="mr-2 h-4 w-4" />
                Take Section Quiz (10 Questions)
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quiz Component */}
      {showQuiz && selectedModule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Section Quiz - {course.modules.find(m => m.id === selectedModule)?.title}
            </CardTitle>
            <CardDescription>
              Answer 10 questions correctly (70% required to pass) and earn your badge!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InteractiveQuiz
              sectionTitle={course.modules.find(m => m.id === selectedModule)?.title || ''}
              questions={getCurrentQuizQuestions()}
              passingScore={70}
              timeLimit={15}
              onComplete={handleQuizComplete}
              onBadgeEarned={handleBadgeEarned}
            />
          </CardContent>
        </Card>
      )}

      {/* Badge System */}
      {showBadgeSystem && userProgress.earnedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Learning Achievements
            </CardTitle>
            <CardDescription>
              Track your progress and view earned badges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BadgeSystem
              badges={userProgress.earnedBadges}
              showProgress={true}
              onBadgeClick={(badge) => {
                toast({
                  title: `${badge.title} Badge`,
                  description: badge.description,
                });
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Course Certificate */}
      {showCertificate && userProgress.courseCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Course Completion Certificate
            </CardTitle>
            <CardDescription>
              Congratulations! Download and share your course completion certificate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CertificateGenerator
              certificateData={{
                studentName: user?.name || user?.email || 'Student',
                courseName: course.title,
                completionDate: new Date().toISOString(),
                grade: Math.round(
                  Object.values(userProgress.quizResults).reduce((acc: number, result: any) => 
                    acc + (result?.percentage || 0), 0
                  ) / Object.keys(userProgress.quizResults).length
                ) >= 90 ? 'A' : Math.round(
                  Object.values(userProgress.quizResults).reduce((acc: number, result: any) => 
                    acc + (result?.percentage || 0), 0
                  ) / Object.keys(userProgress.quizResults).length
                ) >= 80 ? 'B' : 'C',
                percentage: Math.round(
                  Object.values(userProgress.quizResults).reduce((acc: number, result: any) => 
                    acc + (result?.percentage || 0), 0
                  ) / Object.keys(userProgress.quizResults).length
                ),
                instructor: 'DAS AI Learning Platform',
                institution: 'DAS Economics & Business Academy',
                certificateId: `${courseId}-${Date.now()}`,
                duration: course.modules.length + ' modules',
                skills: ['Economic Analysis', 'Critical Thinking', 'Problem Solving']
              }}
              onDownload={() => {
                toast({
                  title: "Certificate Downloaded",
                  description: "Your certificate has been saved successfully!",
                });
              }}
              onShare={() => {
                toast({
                  title: "Certificate Shared",
                  description: "Share link copied to clipboard!",
                });
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Generated Content */}
      {(result || isGenerating || isGeneratingAudio || isGeneratingVisuals) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Your AI-Generated Lesson
              {isGeneratingVisuals && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>
              Interactive lesson with audio, equations, charts, and visual content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Audio Controls */}
            {(audioUrl || isGeneratingAudio) && (
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium mb-1">Podcast Lesson</div>
                  <div className="text-sm text-muted-foreground">
                    {isGeneratingAudio ? 'Generating audio...' : 
                     isPlayingAudio ? `Playing segment ${currentSegment + 1}` : 'Ready to play'}
                  </div>
                  {audioProgress > 0 && (
                    <Progress value={audioProgress} className="mt-2" />
                  )}
                </div>
                <div className="flex gap-2">
                  {audioUrl && (
                    <>
                      <Button
                        onClick={() => isPlayingAudio ? stopAudio() : (result?.podcastScript && playAudio(result.podcastScript))}
                        disabled={isGeneratingAudio}
                        size="sm"
                      >
                        {isPlayingAudio ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button onClick={() => result?.podcastScript && downloadAudio(result.podcastScript)} size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Educational Content */}
            {visualContent && (
              <div className="space-y-6">
                {/* Mathematical Equations */}
                {visualContent.equations && visualContent.equations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Mathematical Concepts
                    </h4>
                    <div className="grid gap-4">
                      {visualContent.equations.map((equation, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium">{equation.title}</h5>
                            <Badge variant="outline">{equation.category}</Badge>
                          </div>
                          <div className="my-4 p-3 bg-background rounded border text-center">
                            <BlockMath math={equation.latex} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{equation.explanation}</p>
                          {equation.variables && equation.variables.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {equation.variables.map((variable, varIndex) => (
                                <div key={varIndex} className="text-xs bg-background/50 p-2 rounded">
                                  <span className="font-mono font-medium">{variable.symbol}</span>
                                  <span className="mx-2">-</span>
                                  <span>{variable.meaning}</span>
                                  {variable.unit && <span className="text-muted-foreground"> ({variable.unit})</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Charts and Graphs */}
                {visualContent.charts && visualContent.charts.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <LineChart className="h-4 w-4" />
                      Data Visualizations
                    </h4>
                    <div className="space-y-6">
                      {visualContent.charts.map((chart, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg">
                          <h5 className="font-medium mb-2">{chart.title}</h5>
                          <p className="text-sm text-muted-foreground mb-4">{chart.description}</p>
                          
                          {chart.data.equation && (
                            <div className="mb-3 p-2 bg-background rounded text-center">
                              <InlineMath math={chart.data.equation} />
                            </div>
                          )}
                          
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              {(() => {
                                if (chart.type === 'bar') {
                                  return (
                                    <BarChart data={chart.data.labels.map((label, i) => ({
                                      name: label,
                                      value: chart.data.values[i] || 0
                                    }))}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis 
                                        dataKey="name" 
                                        label={{ value: chart.xAxisLabel || 'X', position: 'insideBottom', offset: -5 }}
                                      />
                                      <YAxis 
                                        label={{ value: chart.yAxisLabel || 'Y', angle: -90, position: 'insideLeft' }}
                                      />
                                      <Tooltip />
                                      <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                  );
                                } else if (chart.type === 'line' || chart.type === 'function-plot') {
                                  return (
                                    <RechartsLineChart data={chart.data.labels.map((label, i) => ({
                                      name: label,
                                      value: chart.data.values[i] || 0
                                    }))}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis 
                                        dataKey="name" 
                                        label={{ value: chart.xAxisLabel || 'X', position: 'insideBottom', offset: -5 }}
                                      />
                                      <YAxis 
                                        label={{ value: chart.yAxisLabel || 'Y', angle: -90, position: 'insideLeft' }}
                                      />
                                      <Tooltip />
                                      <Legend />
                                      <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke={chart.type === 'function-plot' ? "#ff7300" : "#8884d8"} 
                                        strokeWidth={chart.type === 'function-plot' ? 3 : 2}
                                        dot={chart.type === 'function-plot' ? false : true}
                                      />
                                    </RechartsLineChart>
                                  );
                                } else {
                                  return <div>Unsupported chart type</div>;
                                }
                              })()}
                            </ResponsiveContainer>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Statistics */}
                {visualContent.statistics && visualContent.statistics.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Key Statistics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visualContent.statistics.map((stat, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{stat.value}</div>
                          <div className="font-medium">{stat.label}</div>
                          <div className="text-sm text-muted-foreground mt-1">{stat.context}</div>
                          {stat.formula && (
                            <div className="mt-2 p-2 bg-background rounded text-center">
                              <InlineMath math={stat.formula} />
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">Source: {stat.source}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Terms */}
                {visualContent.keyTerms && visualContent.keyTerms.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Key Terms & Concepts
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visualContent.keyTerms.map((term, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium">{term.term}</h5>
                            {term.symbol && (
                              <span className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                                {term.symbol}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{term.definition}</p>
                          {term.formula && (
                            <div className="mt-2 p-2 bg-background rounded text-center">
                              <InlineMath math={term.formula} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
