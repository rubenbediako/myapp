/**
 * Quiz and Certification System
 * Interactive learning assessment with badges and certificates
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  completedAt: Date;
  timeSpent: number; // in seconds
  wrongAnswers: Array<{
    questionId: string;
    selectedAnswer: number;
    correctAnswer: number;
  }>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'lesson' | 'quiz' | 'course' | 'achievement';
  earnedAt?: Date;
  requirements: string;
}

export interface Certificate {
  id: string;
  courseName: string;
  learnerName: string;
  completionDate: Date;
  finalScore: number;
  badgesEarned: Badge[];
  duration: string; // e.g., "4 weeks"
  certificateNumber: string;
}

export const QUIZ_CONFIG = {
  PASSING_SCORE: 70, // 70% to pass
  QUESTIONS_PER_QUIZ: 10,
  TIME_LIMIT: 900, // 15 minutes in seconds
  RETAKE_LIMIT: 3,
  SHOW_CORRECT_ANSWERS: true
};

// Sample quiz questions for different economic topics
export const SAMPLE_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  'macroeconomics': [
    {
      id: 'macro_001',
      question: 'What is the primary tool used by central banks to control money supply?',
      options: [
        'Fiscal policy',
        'Monetary policy',
        'Trade policy',
        'Labor policy'
      ],
      correctAnswer: 1,
      explanation: 'Monetary policy is the primary tool central banks use to control money supply through interest rates, reserve requirements, and open market operations.',
      difficulty: 'medium',
      topic: 'monetary_policy'
    },
    {
      id: 'macro_002',
      question: 'Which indicator best measures the overall health of an economy?',
      options: [
        'Unemployment rate only',
        'Inflation rate only',
        'GDP growth rate',
        'Stock market performance'
      ],
      correctAnswer: 2,
      explanation: 'GDP growth rate is considered the most comprehensive indicator of economic health as it measures the total value of goods and services produced.',
      difficulty: 'easy',
      topic: 'economic_indicators'
    },
    {
      id: 'macro_003',
      question: 'What happens to aggregate demand when consumer confidence increases?',
      options: [
        'It decreases significantly',
        'It remains unchanged',
        'It increases',
        'It becomes unpredictable'
      ],
      correctAnswer: 2,
      explanation: 'When consumer confidence increases, people are more likely to spend money, which increases aggregate demand in the economy.',
      difficulty: 'medium',
      topic: 'aggregate_demand'
    },
    {
      id: 'macro_004',
      question: 'During a recession, which fiscal policy action is most appropriate?',
      options: [
        'Increase taxes and reduce spending',
        'Decrease taxes and increase spending',
        'Keep taxes and spending unchanged',
        'Only focus on monetary policy'
      ],
      correctAnswer: 1,
      explanation: 'During a recession, expansionary fiscal policy (decreasing taxes and increasing government spending) helps stimulate economic activity.',
      difficulty: 'hard',
      topic: 'fiscal_policy'
    },
    {
      id: 'macro_005',
      question: 'What is the relationship between inflation and unemployment according to the Phillips Curve?',
      options: [
        'Direct positive relationship',
        'Inverse relationship in the short run',
        'No relationship',
        'Always perfectly correlated'
      ],
      correctAnswer: 1,
      explanation: 'The Phillips Curve suggests an inverse relationship between inflation and unemployment in the short run - as one increases, the other tends to decrease.',
      difficulty: 'hard',
      topic: 'phillips_curve'
    },
    {
      id: 'macro_006',
      question: 'Which of the following is NOT a component of GDP calculation?',
      options: [
        'Consumer spending (C)',
        'Government spending (G)',
        'Stock market investments',
        'Net exports (X-M)'
      ],
      correctAnswer: 2,
      explanation: 'GDP = C + I + G + (X-M). Stock market investments are part of Investment (I), but stock market trading itself is not directly counted in GDP.',
      difficulty: 'medium',
      topic: 'gdp_calculation'
    },
    {
      id: 'macro_007',
      question: 'What is stagflation?',
      options: [
        'High inflation with low unemployment',
        'Low inflation with high unemployment',
        'High inflation with high unemployment',
        'Stable prices with stable employment'
      ],
      correctAnswer: 2,
      explanation: 'Stagflation is the simultaneous occurrence of high inflation and high unemployment, which challenges traditional economic theories.',
      difficulty: 'hard',
      topic: 'stagflation'
    },
    {
      id: 'macro_008',
      question: 'Which money supply measure includes cash, checking accounts, and savings accounts?',
      options: [
        'M0 (Monetary base)',
        'M1 (Narrow money)',
        'M2 (Broad money)',
        'M3 (Broad money plus large deposits)'
      ],
      correctAnswer: 2,
      explanation: 'M2 includes M1 (cash and checking accounts) plus savings accounts, money market accounts, and small time deposits.',
      difficulty: 'medium',
      topic: 'money_supply'
    },
    {
      id: 'macro_009',
      question: 'What is the multiplier effect in economics?',
      options: [
        'The effect of compound interest',
        'How initial spending creates additional economic activity',
        'The relationship between supply and demand',
        'The impact of technology on productivity'
      ],
      correctAnswer: 1,
      explanation: 'The multiplier effect describes how an initial injection of spending into the economy creates a larger overall increase in economic activity.',
      difficulty: 'medium',
      topic: 'multiplier_effect'
    },
    {
      id: 'macro_010',
      question: 'Which economic school of thought emphasizes the role of aggregate demand in economic fluctuations?',
      options: [
        'Classical economics',
        'Keynesian economics',
        'Austrian economics',
        'Chicago school'
      ],
      correctAnswer: 1,
      explanation: 'Keynesian economics emphasizes that changes in aggregate demand are the primary driver of economic fluctuations and supports government intervention.',
      difficulty: 'easy',
      topic: 'economic_schools'
    }
  ],
  
  'personal_finance': [
    {
      id: 'pf_001',
      question: 'What is the 50/30/20 budgeting rule?',
      options: [
        '50% savings, 30% needs, 20% wants',
        '50% needs, 30% wants, 20% savings',
        '50% wants, 30% savings, 20% needs',
        '50% investments, 30% expenses, 20% emergency fund'
      ],
      correctAnswer: 1,
      explanation: 'The 50/30/20 rule allocates 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment.',
      difficulty: 'easy',
      topic: 'budgeting'
    },
    {
      id: 'pf_002',
      question: 'How many months of expenses should you keep in an emergency fund?',
      options: [
        '1-2 months',
        '3-6 months',
        '12 months',
        '24 months'
      ],
      correctAnswer: 1,
      explanation: 'Financial experts typically recommend keeping 3-6 months of living expenses in an emergency fund for unexpected situations.',
      difficulty: 'easy',
      topic: 'emergency_fund'
    },
    {
      id: 'pf_003',
      question: 'What is compound interest?',
      options: [
        'Interest paid only on the principal amount',
        'Interest paid on both principal and previously earned interest',
        'Interest that compounds daily only',
        'Interest that is taxed twice'
      ],
      correctAnswer: 1,
      explanation: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods.',
      difficulty: 'medium',
      topic: 'compound_interest'
    },
    {
      id: 'pf_004',
      question: 'Which debt repayment strategy focuses on paying off the highest interest rate debt first?',
      options: [
        'Debt snowball method',
        'Debt avalanche method',
        'Minimum payment method',
        'Consolidation method'
      ],
      correctAnswer: 1,
      explanation: 'The debt avalanche method prioritizes paying off debts with the highest interest rates first to minimize total interest paid.',
      difficulty: 'medium',
      topic: 'debt_management'
    },
    {
      id: 'pf_005',
      question: 'What is dollar-cost averaging?',
      options: [
        'Investing a lump sum all at once',
        'Investing fixed amounts at regular intervals regardless of market conditions',
        'Only investing when markets are down',
        'Averaging the cost of your purchases'
      ],
      correctAnswer: 1,
      explanation: 'Dollar-cost averaging involves investing a fixed amount regularly, which can help reduce the impact of market volatility.',
      difficulty: 'medium',
      topic: 'investing_strategies'
    }
  ],

  'investment': [
    {
      id: 'inv_001',
      question: 'What is diversification in investing?',
      options: [
        'Putting all money in one stock',
        'Spreading investments across different assets to reduce risk',
        'Only investing in bonds',
        'Timing the market perfectly'
      ],
      correctAnswer: 1,
      explanation: 'Diversification involves spreading investments across various assets, sectors, and geographic regions to reduce overall portfolio risk.',
      difficulty: 'easy',
      topic: 'diversification'
    },
    {
      id: 'inv_002',
      question: 'What does P/E ratio measure?',
      options: [
        'Profit to Equity ratio',
        'Price to Earnings ratio',
        'Performance to Expectation ratio',
        'Principal to Expense ratio'
      ],
      correctAnswer: 1,
      explanation: 'P/E ratio (Price-to-Earnings) measures how much investors are willing to pay per dollar of earnings, indicating if a stock is over or undervalued.',
      difficulty: 'medium',
      topic: 'valuation_metrics'
    },
    {
      id: 'inv_003',
      question: 'Which investment generally offers the highest potential returns but also the highest risk?',
      options: [
        'Government bonds',
        'Savings accounts',
        'Individual stocks',
        'Certificate of deposits'
      ],
      correctAnswer: 2,
      explanation: 'Individual stocks generally offer the highest potential returns but also carry the highest risk due to price volatility and company-specific risks.',
      difficulty: 'easy',
      topic: 'risk_return'
    }
  ]
};

// Badge definitions
export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first_quiz',
    name: 'Quiz Rookie',
    description: 'Completed your first quiz',
    icon: '🎯',
    category: 'quiz',
    requirements: 'Complete any quiz with at least 50% score'
  },
  {
    id: 'perfect_score',
    name: 'Perfect Scholar',
    description: 'Achieved 100% on a quiz',
    icon: '🏆',
    category: 'quiz',
    requirements: 'Score 100% on any quiz'
  },
  {
    id: 'quick_learner',
    name: 'Speed Demon',
    description: 'Completed a quiz in under 5 minutes',
    icon: '⚡',
    category: 'achievement',
    requirements: 'Complete a 10-question quiz in under 5 minutes'
  },
  {
    id: 'economics_basics',
    name: 'Economics Explorer',
    description: 'Mastered basic economics concepts',
    icon: '📊',
    category: 'lesson',
    requirements: 'Pass all basic economics quizzes with 70%+'
  },
  {
    id: 'finance_guru',
    name: 'Finance Guru',
    description: 'Expert in personal finance',
    icon: '💰',
    category: 'lesson',
    requirements: 'Pass all personal finance quizzes with 80%+'
  },
  {
    id: 'investment_master',
    name: 'Investment Master',
    description: 'Mastered investment strategies',
    icon: '📈',
    category: 'lesson',
    requirements: 'Pass all investment quizzes with 85%+'
  },
  {
    id: 'course_complete',
    name: 'Course Champion',
    description: 'Completed an entire course',
    icon: '🎓',
    category: 'course',
    requirements: 'Complete all lessons and quizzes in a course'
  },
  {
    id: 'persistent_learner',
    name: 'Never Give Up',
    description: 'Retook a quiz until passing',
    icon: '💪',
    category: 'achievement',
    requirements: 'Pass a quiz after failing it at least once'
  }
];

export class QuizEngine {
  private userProgress: Map<string, QuizResult[]> = new Map();
  private userBadges: Map<string, Badge[]> = new Map();

  /**
   * Generate a quiz for a specific topic
   */
  generateQuiz(topic: string, questionCount: number = QUIZ_CONFIG.QUESTIONS_PER_QUIZ): QuizQuestion[] {
    const topicQuestions = SAMPLE_QUIZ_QUESTIONS[topic] || [];
    
    if (topicQuestions.length < questionCount) {
      // If not enough questions, return all available questions
      return topicQuestions;
    }

    // Randomly select questions
    const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, questionCount);
  }

  /**
   * Evaluate quiz answers and return results
   */
  evaluateQuiz(
    userId: string,
    quizId: string,
    questions: QuizQuestion[],
    userAnswers: number[],
    timeSpent: number
  ): QuizResult {
    let correctCount = 0;
    const wrongAnswers: QuizResult['wrongAnswers'] = [];

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer === question.correctAnswer) {
        correctCount++;
      } else {
        wrongAnswers.push({
          questionId: question.id,
          selectedAnswer: userAnswer,
          correctAnswer: question.correctAnswer
        });
      }
    });

    const score = correctCount;
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= QUIZ_CONFIG.PASSING_SCORE;

    const result: QuizResult = {
      quizId,
      score,
      totalQuestions,
      percentage,
      passed,
      completedAt: new Date(),
      timeSpent,
      wrongAnswers
    };

    // Store user progress
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, []);
    }
    this.userProgress.get(userId)!.push(result);

    // Check for badge achievements
    this.checkBadgeAchievements(userId, result, timeSpent);

    return result;
  }

  /**
   * Check if user earned any badges
   */
  private checkBadgeAchievements(userId: string, result: QuizResult, timeSpent: number) {
    const userBadges = this.userBadges.get(userId) || [];
    const userProgress = this.userProgress.get(userId) || [];
    const newBadges: Badge[] = [];

    // Check for various badge conditions
    AVAILABLE_BADGES.forEach(badge => {
      // Skip if user already has this badge
      if (userBadges.some(ub => ub.id === badge.id)) return;

      let shouldAward = false;

      switch (badge.id) {
        case 'first_quiz':
          shouldAward = userProgress.length === 1 && result.percentage >= 50;
          break;
        case 'perfect_score':
          shouldAward = result.percentage === 100;
          break;
        case 'quick_learner':
          shouldAward = timeSpent < 300 && result.passed; // 5 minutes
          break;
        case 'persistent_learner':
          const sameQuizAttempts = userProgress.filter(p => p.quizId === result.quizId);
          shouldAward = sameQuizAttempts.length > 1 && result.passed && 
                       sameQuizAttempts.some(p => !p.passed);
          break;
      }

      if (shouldAward) {
        const earnedBadge = { ...badge, earnedAt: new Date() };
        newBadges.push(earnedBadge);
        userBadges.push(earnedBadge);
      }
    });

    if (newBadges.length > 0) {
      this.userBadges.set(userId, userBadges);
    }
  }

  /**
   * Get user's quiz history
   */
  getUserProgress(userId: string): QuizResult[] {
    return this.userProgress.get(userId) || [];
  }

  /**
   * Get user's earned badges
   */
  getUserBadges(userId: string): Badge[] {
    return this.userBadges.get(userId) || [];
  }

  /**
   * Generate certificate data for course completion
   */
  generateCertificate(userId: string, courseName: string, learnerName: string): Certificate {
    const userBadges = this.getUserBadges(userId);
    const userProgress = this.getUserProgress(userId);
    
    // Calculate average score
    const courseQuizzes = userProgress.filter(p => p.passed);
    const averageScore = courseQuizzes.length > 0 
      ? Math.round(courseQuizzes.reduce((sum, quiz) => sum + quiz.percentage, 0) / courseQuizzes.length)
      : 0;

    const certificate: Certificate = {
      id: `cert_${Date.now()}_${userId}`,
      courseName,
      learnerName,
      completionDate: new Date(),
      finalScore: averageScore,
      badgesEarned: userBadges,
      duration: this.calculateCourseDuration(userProgress),
      certificateNumber: this.generateCertificateNumber()
    };

    return certificate;
  }

  private calculateCourseDuration(progress: QuizResult[]): string {
    if (progress.length === 0) return '0 days';
    
    const firstQuiz = progress[0].completedAt;
    const lastQuiz = progress[progress.length - 1].completedAt;
    const diffTime = Math.abs(lastQuiz.getTime() - firstQuiz.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  }

  private generateCertificateNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `DASAI-${year}${month}-${random}`;
  }
}

// Export a singleton instance
export const quizEngine = new QuizEngine();
