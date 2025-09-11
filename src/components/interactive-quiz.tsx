'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Award, 
  Clock, 
  Target,
  Download,
  RotateCcw,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

interface QuizResult {
  score: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, number>;
  timeSpent: number;
}

interface InteractiveQuizProps {
  sectionTitle: string;
  questions: QuizQuestion[];
  passingScore?: number;
  timeLimit?: number; // in minutes
  onComplete?: (result: QuizResult) => void;
  onBadgeEarned?: (badge: any) => void;
}

export function InteractiveQuiz({
  sectionTitle,
  questions,
  passingScore = 70,
  timeLimit = 15,
  onComplete,
  onBadgeEarned
}: InteractiveQuizProps) {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // Convert to seconds
  const [startTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);

  // Timer effect
  useEffect(() => {
    if (showResults || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      toast({
        title: "Please select an answer",
        description: "You must choose an option before proceeding.",
        variant: "destructive"
      });
      return;
    }

    // Save the answer
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: selectedAnswer
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[questions[currentQuestion - 1].id] || null);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    // Include current answer if selected
    const finalAnswers = selectedAnswer !== null 
      ? { ...answers, [questions[currentQuestion].id]: selectedAnswer }
      : answers;

    // Calculate score
    let correctCount = 0;
    questions.forEach(question => {
      if (finalAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= passingScore;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    const result: QuizResult = {
      score: correctCount,
      percentage,
      passed,
      answers: finalAnswers,
      timeSpent
    };

    setQuizResult(result);
    setShowResults(true);

    // Award badge if passed
    if (passed && onBadgeEarned) {
      const badge = {
        id: `quiz-${sectionTitle.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${sectionTitle} Expert`,
        description: `Completed ${sectionTitle} quiz with ${percentage}% score`,
        type: 'quiz',
        earnedAt: new Date().toISOString(),
        score: percentage
      };
      onBadgeEarned(badge);
    }

    if (onComplete) {
      onComplete(result);
    }

    toast({
      title: passed ? "Congratulations!" : "Quiz Complete",
      description: passed 
        ? `You passed with ${percentage}%! Badge earned!`
        : `You scored ${percentage}%. Need ${passingScore}% to pass.`,
      variant: passed ? "default" : "destructive"
    });
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedAnswer(null);
    setShowResults(false);
    setQuizResult(null);
    setTimeRemaining(timeLimit * 60);
    setShowExplanation(false);
  };

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  if (showResults && quizResult) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {quizResult.passed ? (
              <Trophy className="h-16 w-16 text-yellow-500" />
            ) : (
              <Target className="h-16 w-16 text-gray-400" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {quizResult.passed ? "Quiz Completed Successfully!" : "Quiz Completed"}
          </CardTitle>
          <CardDescription>
            {sectionTitle} Assessment Results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {quizResult.score}/{questions.length}
              </div>
              <div className="text-sm text-gray-600">Questions Correct</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {quizResult.percentage}%
              </div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatTime(quizResult.timeSpent)}
              </div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {quizResult.passed ? "PASS" : "RETRY"}
              </div>
              <div className="text-sm text-gray-600">Result</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Score Progress</span>
              <span>{quizResult.percentage}% (Need {passingScore}%)</span>
            </div>
            <Progress 
              value={quizResult.percentage} 
              className={`h-3 ${quizResult.passed ? 'bg-green-100' : 'bg-red-100'}`}
            />
          </div>

          {/* Badge Earned */}
          {quizResult.passed && (
            <div className="text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-yellow-800">Badge Earned!</h3>
              <p className="text-yellow-700">{sectionTitle} Expert</p>
              <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-800">
                Quiz Master
              </Badge>
            </div>
          )}

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Question Review</h3>
            {questions.map((question, index) => {
              const userAnswer = quizResult.answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">Q{index + 1}: {question.question}</p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Your answer:</span>{' '}
                            <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {question.options[userAnswer]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="font-medium">Correct answer:</span>{' '}
                              <span className="text-green-600">
                                {question.options[question.correctAnswer]}
                              </span>
                            </p>
                          )}
                          <p className="text-gray-600 mt-2">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRetakeQuiz} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </Button>
            {quizResult.passed && (
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Certificate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-xl">
            {sectionTitle} Quiz
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              {formatTime(timeRemaining)}
            </div>
            <Badge variant="outline">
              {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <CardDescription>
          Answer all questions to complete the section. Passing score: {passingScore}%
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium mb-2">
                Question {currentQuestion + 1}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {question.question}
              </p>
              {question.category && (
                <Badge variant="secondary" className="mt-2">
                  {question.category}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Answer Options */}
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm leading-relaxed">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Explanation Toggle */}
        {selectedAnswer !== null && (
          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={toggleExplanation}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showExplanation ? 'Hide' : 'Show'} Explanation
            </Button>
            {showExplanation && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">{question.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
