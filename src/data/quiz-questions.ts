/**
 * Quiz Questions Database for Economics Learning Platform
 * Contains multiple choice questions for different economic topics
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

export const ECONOMICS_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  // Macroeconomics Section
  macroeconomics: [
    {
      id: "macro_01",
      question: "What is the primary goal of fiscal policy during a recession?",
      options: [
        "Reduce government spending to balance the budget",
        "Increase government spending and/or reduce taxes to stimulate economic growth",
        "Maintain constant tax rates regardless of economic conditions",
        "Focus solely on reducing the national debt"
      ],
      correctAnswer: 1,
      explanation: "During a recession, expansionary fiscal policy (increasing government spending and/or reducing taxes) is used to stimulate economic activity and boost aggregate demand.",
      category: "Fiscal Policy"
    },
    {
      id: "macro_02",
      question: "Which of the following best describes GDP (Gross Domestic Product)?",
      options: [
        "The total value of all goods and services consumed in a country",
        "The total value of all final goods and services produced within a country's borders in a given period",
        "The total income earned by a country's citizens worldwide",
        "The total value of a country's natural resources"
      ],
      correctAnswer: 1,
      explanation: "GDP measures the total monetary value of all final goods and services produced within a country's borders during a specific time period, typically a year.",
      category: "National Income"
    },
    {
      id: "macro_03",
      question: "What happens to aggregate demand when the central bank lowers interest rates?",
      options: [
        "Aggregate demand decreases due to reduced investment",
        "Aggregate demand increases due to cheaper borrowing costs",
        "Aggregate demand remains unchanged",
        "Only consumption increases, not investment"
      ],
      correctAnswer: 1,
      explanation: "Lower interest rates reduce borrowing costs, encouraging both consumer spending and business investment, which increases aggregate demand.",
      category: "Monetary Policy"
    },
    {
      id: "macro_04",
      question: "The Phillips Curve traditionally shows the relationship between:",
      options: [
        "GDP and inflation",
        "Unemployment and inflation",
        "Interest rates and exchange rates",
        "Government spending and taxes"
      ],
      correctAnswer: 1,
      explanation: "The Phillips Curve illustrates the inverse relationship between unemployment and inflation rates in the short run.",
      category: "Labor Economics"
    },
    {
      id: "macro_05",
      question: "Which factor would most likely cause cost-push inflation?",
      options: [
        "Increase in consumer demand",
        "Decrease in unemployment",
        "Increase in oil prices",
        "Expansion of money supply"
      ],
      correctAnswer: 2,
      explanation: "Cost-push inflation occurs when production costs increase, such as rising oil prices, forcing businesses to raise prices to maintain profit margins.",
      category: "Inflation"
    },
    {
      id: "macro_06",
      question: "What is the multiplier effect in economics?",
      options: [
        "The effect of compound interest on savings",
        "The amplified impact of an initial change in spending on the overall economy",
        "The relationship between price and quantity demanded",
        "The effect of exchange rates on trade"
      ],
      correctAnswer: 1,
      explanation: "The multiplier effect describes how an initial change in spending (like government investment) creates a larger change in total economic output through successive rounds of spending.",
      category: "Economic Theory"
    },
    {
      id: "macro_07",
      question: "Which of the following is NOT typically considered a leading economic indicator?",
      options: [
        "Stock market performance",
        "Unemployment rate",
        "Building permits",
        "Consumer confidence index"
      ],
      correctAnswer: 1,
      explanation: "The unemployment rate is a lagging indicator that reflects past economic performance, while the others are leading indicators that help predict future economic trends.",
      category: "Economic Indicators"
    },
    {
      id: "macro_08",
      question: "In the context of international trade, what does a current account deficit indicate?",
      options: [
        "The country exports more than it imports",
        "The country imports more than it exports",
        "The country has a balanced trade relationship",
        "The country's currency is overvalued"
      ],
      correctAnswer: 1,
      explanation: "A current account deficit occurs when a country's total imports (goods, services, and transfers) exceed its total exports, indicating it's spending more on foreign trade than it's earning.",
      category: "International Trade"
    },
    {
      id: "macro_09",
      question: "What is quantitative easing?",
      options: [
        "Reducing government spending during economic growth",
        "A monetary policy where central banks purchase securities to increase money supply",
        "Increasing tax rates to control inflation",
        "Reducing regulations on financial institutions"
      ],
      correctAnswer: 1,
      explanation: "Quantitative easing is an unconventional monetary policy tool where central banks buy government securities or other securities to inject money directly into the economy.",
      category: "Monetary Policy"
    },
    {
      id: "macro_10",
      question: "According to Keynesian theory, during a recession, the government should:",
      options: [
        "Reduce spending to avoid increasing debt",
        "Increase spending even if it leads to budget deficits",
        "Maintain neutral fiscal policy",
        "Focus only on monetary policy solutions"
      ],
      correctAnswer: 1,
      explanation: "Keynesian economics advocates for counter-cyclical fiscal policy, suggesting governments should increase spending during recessions to stimulate demand, even if it creates temporary deficits.",
      category: "Economic Theory"
    }
  ],

  // Microeconomics Section
  microeconomics: [
    {
      id: "micro_01",
      question: "What does the law of demand state?",
      options: [
        "As price increases, quantity demanded increases",
        "As price decreases, quantity demanded decreases",
        "As price increases, quantity demanded decreases, all else being equal",
        "Price and quantity demanded are unrelated"
      ],
      correctAnswer: 2,
      explanation: "The law of demand states that there is an inverse relationship between price and quantity demanded, assuming all other factors remain constant (ceteris paribus).",
      category: "Supply and Demand"
    },
    {
      id: "micro_02",
      question: "What is price elasticity of demand?",
      options: [
        "The change in price due to a change in demand",
        "The responsiveness of quantity demanded to a change in price",
        "The maximum price consumers are willing to pay",
        "The minimum price producers are willing to accept"
      ],
      correctAnswer: 1,
      explanation: "Price elasticity of demand measures how responsive the quantity demanded is to changes in price, calculated as the percentage change in quantity demanded divided by the percentage change in price.",
      category: "Elasticity"
    },
    {
      id: "micro_03",
      question: "In perfect competition, firms are:",
      options: [
        "Price makers who can set their own prices",
        "Price takers who must accept the market price",
        "Able to earn long-term economic profits",
        "Protected by barriers to entry"
      ],
      correctAnswer: 1,
      explanation: "In perfect competition, individual firms are price takers because they have no market power to influence price due to the large number of competitors and homogeneous products.",
      category: "Market Structures"
    },
    {
      id: "micro_04",
      question: "What is consumer surplus?",
      options: [
        "The difference between what consumers pay and the cost of production",
        "The difference between what consumers are willing to pay and what they actually pay",
        "The total amount consumers spend on a product",
        "The profit earned by consumers from investments"
      ],
      correctAnswer: 1,
      explanation: "Consumer surplus is the difference between the maximum amount consumers are willing to pay for a good and the actual market price they pay.",
      category: "Consumer Theory"
    },
    {
      id: "micro_05",
      question: "Which of the following best describes a monopoly?",
      options: [
        "Many sellers offering identical products",
        "A few large sellers dominating the market",
        "A single seller with no close substitutes and barriers to entry",
        "Many sellers offering differentiated products"
      ],
      correctAnswer: 2,
      explanation: "A monopoly exists when there is a single seller of a product with no close substitutes, and significant barriers prevent other firms from entering the market.",
      category: "Market Structures"
    },
    {
      id: "micro_06",
      question: "What is opportunity cost?",
      options: [
        "The monetary cost of producing a good",
        "The value of the next best alternative foregone when making a choice",
        "The cost of raw materials used in production",
        "The total cost of all alternatives considered"
      ],
      correctAnswer: 1,
      explanation: "Opportunity cost represents the value of the next best alternative that must be given up when making a choice, reflecting the concept of scarcity.",
      category: "Economic Fundamentals"
    },
    {
      id: "micro_07",
      question: "In the short run, a firm should continue production as long as:",
      options: [
        "Total revenue equals total cost",
        "Price is greater than average total cost",
        "Price is greater than average variable cost",
        "Economic profit is positive"
      ],
      correctAnswer: 2,
      explanation: "In the short run, a firm should continue production as long as price exceeds average variable cost, allowing it to cover variable costs and contribute to fixed costs.",
      category: "Production Theory"
    },
    {
      id: "micro_08",
      question: "What causes a rightward shift in the demand curve?",
      options: [
        "A decrease in the price of the good",
        "An increase in consumer income (for normal goods)",
        "An increase in the price of complementary goods",
        "A decrease in the number of buyers"
      ],
      correctAnswer: 1,
      explanation: "An increase in consumer income shifts the demand curve rightward for normal goods, as consumers are willing to buy more at each price level.",
      category: "Supply and Demand"
    },
    {
      id: "micro_09",
      question: "What is the difference between accounting profit and economic profit?",
      options: [
        "There is no difference between them",
        "Economic profit includes implicit costs while accounting profit does not",
        "Accounting profit includes implicit costs while economic profit does not",
        "Economic profit is always higher than accounting profit"
      ],
      correctAnswer: 1,
      explanation: "Economic profit accounts for both explicit costs (out-of-pocket expenses) and implicit costs (opportunity costs), while accounting profit only considers explicit costs.",
      category: "Profit Analysis"
    },
    {
      id: "micro_10",
      question: "What characterizes an oligopoly market structure?",
      options: [
        "Many small firms with identical products",
        "One dominant firm controlling the entire market",
        "A few large firms with significant market power and interdependence",
        "Perfect information and free entry and exit"
      ],
      correctAnswer: 2,
      explanation: "An oligopoly is characterized by a few large firms that dominate the market, where each firm's decisions significantly affect competitors, leading to strategic interdependence.",
      category: "Market Structures"
    }
  ],

  // International Economics Section
  international: [
    {
      id: "intl_01",
      question: "What is the principle of comparative advantage?",
      options: [
        "Countries should only produce goods they can make most efficiently",
        "Countries should produce and export goods for which they have the lowest opportunity cost",
        "Countries should only trade with neighboring nations",
        "Countries should aim for complete self-sufficiency"
      ],
      correctAnswer: 1,
      explanation: "Comparative advantage suggests that countries should specialize in producing goods where they have the lowest opportunity cost, even if they don't have an absolute advantage.",
      category: "Trade Theory"
    },
    {
      id: "intl_02",
      question: "What happens to a country's currency when it experiences a trade surplus?",
      options: [
        "The currency typically depreciates",
        "The currency typically appreciates",
        "The currency remains stable",
        "The currency becomes volatile"
      ],
      correctAnswer: 1,
      explanation: "A trade surplus increases demand for the country's currency as foreign buyers need it to purchase exports, typically leading to currency appreciation.",
      category: "Exchange Rates"
    },
    {
      id: "intl_03",
      question: "What is a tariff designed to do?",
      options: [
        "Increase imports and reduce domestic production",
        "Protect domestic industries by making imports more expensive",
        "Eliminate all international trade",
        "Reduce government revenue"
      ],
      correctAnswer: 1,
      explanation: "Tariffs are taxes on imports designed to protect domestic industries by making foreign goods more expensive relative to domestic products.",
      category: "Trade Policy"
    },
    {
      id: "intl_04",
      question: "What is purchasing power parity (PPP)?",
      options: [
        "The idea that identical goods should cost the same in different countries when prices are expressed in a common currency",
        "A trade agreement between countries",
        "A type of foreign exchange market",
        "A measure of economic development"
      ],
      correctAnswer: 0,
      explanation: "PPP is the theory that exchange rates should adjust so that identical goods cost the same across countries when prices are converted to a common currency.",
      category: "Exchange Rates"
    },
    {
      id: "intl_05",
      question: "What is the balance of payments?",
      options: [
        "A country's government budget",
        "A record of all economic transactions between residents of a country and the rest of the world",
        "The difference between exports and imports only",
        "A measure of foreign investment"
      ],
      correctAnswer: 1,
      explanation: "The balance of payments is a comprehensive record of all economic transactions (trade, investment, transfers) between a country's residents and the rest of the world.",
      category: "International Finance"
    },
    {
      id: "intl_06",
      question: "What effect does currency depreciation typically have on a country's exports?",
      options: [
        "Makes exports more expensive and less competitive",
        "Makes exports cheaper and more competitive",
        "Has no effect on export competitiveness",
        "Only affects imports, not exports"
      ],
      correctAnswer: 1,
      explanation: "Currency depreciation makes a country's goods cheaper for foreign buyers, typically increasing export competitiveness and export volumes.",
      category: "Exchange Rates"
    },
    {
      id: "intl_07",
      question: "What is foreign direct investment (FDI)?",
      options: [
        "Buying government bonds of another country",
        "Short-term speculation in foreign currency markets",
        "Long-term investment in business operations in another country",
        "Purchasing foreign stocks on stock exchanges"
      ],
      correctAnswer: 2,
      explanation: "FDI involves long-term investment where an investor establishes business operations or acquires significant ownership in enterprises in another country.",
      category: "International Investment"
    },
    {
      id: "intl_08",
      question: "What is a free trade agreement designed to achieve?",
      options: [
        "Increase tariffs between participating countries",
        "Reduce or eliminate trade barriers between participating countries",
        "Establish a common currency",
        "Create uniform labor laws"
      ],
      correctAnswer: 1,
      explanation: "Free trade agreements aim to reduce or eliminate trade barriers (tariffs, quotas, restrictions) between participating countries to increase trade and economic efficiency.",
      category: "Trade Policy"
    },
    {
      id: "intl_09",
      question: "What is the World Trade Organization (WTO) primarily responsible for?",
      options: [
        "Providing loans to developing countries",
        "Setting global environmental standards",
        "Regulating international trade rules and resolving trade disputes",
        "Managing global currency exchange rates"
      ],
      correctAnswer: 2,
      explanation: "The WTO is the global organization that sets rules for international trade and provides a forum for resolving trade disputes between member countries.",
      category: "International Organizations"
    },
    {
      id: "intl_10",
      question: "What is a current account in the balance of payments?",
      options: [
        "Only the trade balance (exports minus imports)",
        "The record of all short-term capital flows",
        "The record of trade in goods and services, income flows, and current transfers",
        "Government spending on foreign affairs"
      ],
      correctAnswer: 2,
      explanation: "The current account includes trade in goods and services, primary income (investment income), and secondary income (transfers like foreign aid).",
      category: "International Finance"
    }
  ],

  // Personal Finance Section
  personalFinance: [
    {
      id: "pf_01",
      question: "What is compound interest?",
      options: [
        "Interest calculated only on the principal amount",
        "Interest calculated on the principal plus previously earned interest",
        "A fixed rate of return on investments",
        "Interest that decreases over time"
      ],
      correctAnswer: 1,
      explanation: "Compound interest is interest calculated on the initial principal plus all previously earned interest, creating exponential growth over time.",
      category: "Investment Fundamentals"
    },
    {
      id: "pf_02",
      question: "What is the primary purpose of an emergency fund?",
      options: [
        "To invest in high-risk, high-return assets",
        "To cover unexpected expenses and financial emergencies",
        "To save for luxury purchases",
        "To pay for annual vacations"
      ],
      correctAnswer: 1,
      explanation: "An emergency fund provides financial security by covering unexpected expenses like medical bills, job loss, or major repairs without relying on debt.",
      category: "Financial Planning"
    },
    {
      id: "pf_03",
      question: "What does diversification in investing mean?",
      options: [
        "Investing all money in one high-performing stock",
        "Spreading investments across different asset classes to reduce risk",
        "Only investing in government bonds",
        "Frequently buying and selling stocks"
      ],
      correctAnswer: 1,
      explanation: "Diversification involves spreading investments across various asset classes, sectors, or geographic regions to reduce overall portfolio risk.",
      category: "Investment Strategy"
    },
    {
      id: "pf_04",
      question: "What is a credit score primarily used for?",
      options: [
        "To determine your income level",
        "To assess your creditworthiness for loans and credit cards",
        "To calculate your net worth",
        "To determine your tax bracket"
      ],
      correctAnswer: 1,
      explanation: "A credit score is a numerical representation of creditworthiness that lenders use to evaluate the risk of lending money or extending credit.",
      category: "Credit Management"
    },
    {
      id: "pf_05",
      question: "What is the 50/30/20 budgeting rule?",
      options: [
        "50% savings, 30% needs, 20% wants",
        "50% needs, 30% wants, 20% savings and debt repayment",
        "50% wants, 30% needs, 20% investments",
        "50% debt repayment, 30% savings, 20% expenses"
      ],
      correctAnswer: 1,
      explanation: "The 50/30/20 rule suggests allocating 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment.",
      category: "Budgeting"
    },
    {
      id: "pf_06",
      question: "What is the main advantage of a Roth IRA over a traditional IRA?",
      options: [
        "Higher contribution limits",
        "Tax-free withdrawals in retirement",
        "Immediate tax deductions",
        "No investment options restrictions"
      ],
      correctAnswer: 1,
      explanation: "Roth IRA contributions are made with after-tax dollars, allowing for tax-free withdrawals of both contributions and earnings in retirement.",
      category: "Retirement Planning"
    },
    {
      id: "pf_07",
      question: "What is dollar-cost averaging?",
      options: [
        "Investing a large sum all at once",
        "Investing fixed amounts regularly regardless of market conditions",
        "Only investing when markets are down",
        "Timing the market to maximize returns"
      ],
      correctAnswer: 1,
      explanation: "Dollar-cost averaging involves investing fixed amounts at regular intervals, which can help reduce the impact of market volatility on investment purchases.",
      category: "Investment Strategy"
    },
    {
      id: "pf_08",
      question: "What is the debt avalanche method?",
      options: [
        "Paying minimum on all debts and extra on the smallest balance",
        "Paying minimum on all debts and extra on the highest interest rate debt",
        "Paying equal amounts on all debts",
        "Ignoring debt until you have more income"
      ],
      correctAnswer: 1,
      explanation: "The debt avalanche method prioritizes paying off high-interest debts first to minimize total interest paid over time.",
      category: "Debt Management"
    },
    {
      id: "pf_09",
      question: "What is the purpose of life insurance?",
      options: [
        "To provide investment returns",
        "To provide financial protection for dependents in case of death",
        "To save money for retirement",
        "To cover medical expenses"
      ],
      correctAnswer: 1,
      explanation: "Life insurance provides financial protection by paying benefits to beneficiaries upon the death of the insured, helping support dependents financially.",
      category: "Insurance"
    },
    {
      id: "pf_10",
      question: "What is asset allocation?",
      options: [
        "Choosing individual stocks to buy",
        "The distribution of investments among different asset categories",
        "Timing when to buy and sell investments",
        "Calculating the total value of your portfolio"
      ],
      correctAnswer: 1,
      explanation: "Asset allocation is the strategy of dividing investments among different asset categories (stocks, bonds, cash) based on goals, risk tolerance, and time horizon.",
      category: "Investment Strategy"
    }
  ]
};

// Organized quiz questions by course and module
export const quizQuestions = {
  microeconomics: {
    module1: ECONOMICS_QUIZ_QUESTIONS.microeconomics.slice(0, 10),
    module2: ECONOMICS_QUIZ_QUESTIONS.microeconomics.slice(10, 20) || ECONOMICS_QUIZ_QUESTIONS.microeconomics.slice(0, 10),
    module3: ECONOMICS_QUIZ_QUESTIONS.microeconomics.slice(20, 30) || ECONOMICS_QUIZ_QUESTIONS.microeconomics.slice(0, 10),
    module4: ECONOMICS_QUIZ_QUESTIONS.microeconomics.slice(30, 40) || ECONOMICS_QUIZ_QUESTIONS.microeconomics.slice(0, 10),
    module5: ECONOMICS_QUIZ_QUESTIONS.microeconomics.slice(40, 50) || ECONOMICS_QUIZ_QUESTIONS.microeconomics.slice(0, 10)
  },
  macroeconomics: {
    module1: ECONOMICS_QUIZ_QUESTIONS.macroeconomics.slice(0, 10),
    module2: ECONOMICS_QUIZ_QUESTIONS.macroeconomics.slice(10, 20) || ECONOMICS_QUIZ_QUESTIONS.macroeconomics.slice(0, 10),
    module3: ECONOMICS_QUIZ_QUESTIONS.macroeconomics.slice(20, 30) || ECONOMICS_QUIZ_QUESTIONS.macroeconomics.slice(0, 10),
    module4: ECONOMICS_QUIZ_QUESTIONS.macroeconomics.slice(30, 40) || ECONOMICS_QUIZ_QUESTIONS.macroeconomics.slice(0, 10),
    module5: ECONOMICS_QUIZ_QUESTIONS.macroeconomics.slice(40, 50) || ECONOMICS_QUIZ_QUESTIONS.macroeconomics.slice(0, 10)
  },
  entrepreneurship: {
    module1: ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(0, 10),
    module2: ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(10, 20) || ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(0, 10),
    module3: ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(20, 30) || ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(0, 10),
    module4: ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(30, 40) || ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(0, 10),
    module5: ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(40, 50) || ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(0, 10)
  },
  'international-trade': {
    module1: ECONOMICS_QUIZ_QUESTIONS.internationalEconomics.slice(0, 10),
    module2: ECONOMICS_QUIZ_QUESTIONS.internationalEconomics.slice(10, 20) || ECONOMICS_QUIZ_QUESTIONS.internationalEconomics.slice(0, 10),
    module3: ECONOMICS_QUIZ_QUESTIONS.internationalEconomics.slice(20, 30) || ECONOMICS_QUIZ_QUESTIONS.internationalEconomics.slice(0, 10),
    module4: ECONOMICS_QUIZ_QUESTIONS.internationalEconomics.slice(30, 40) || ECONOMICS_QUIZ_QUESTIONS.internationalEconomics.slice(0, 10),
    module5: ECONOMICS_QUIZ_QUESTIONS.internationalEconomics.slice(40, 50) || ECONOMICS_QUIZ_QUESTIONS.internationalEconomics.slice(0, 10)
  },
  'banking-and-finance': {
    module1: ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(0, 10),
    module2: ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(10, 20) || ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(0, 10),
    module3: ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(20, 30) || ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(0, 10),
    module4: ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(30, 40) || ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(0, 10),
    module5: ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(40, 50) || ECONOMICS_QUIZ_QUESTIONS.personalFinance.slice(0, 10)
  }
};

// Badge templates for different achievements
export const BADGE_TEMPLATES = {
  quiz: {
    bronze: { minScore: 70, maxScore: 79, level: 'bronze' as const },
    silver: { minScore: 80, maxScore: 89, level: 'silver' as const },
    gold: { minScore: 90, maxScore: 94, level: 'gold' as const },
    platinum: { minScore: 95, maxScore: 100, level: 'platinum' as const }
  },
  lesson: {
    bronze: { requirement: 'Complete lesson', level: 'bronze' as const },
    silver: { requirement: 'Complete lesson + 1 quiz', level: 'silver' as const },
    gold: { requirement: 'Complete lesson + all quizzes', level: 'gold' as const },
    platinum: { requirement: 'Perfect scores on all assessments', level: 'platinum' as const }
  }
};

// Course completion requirements
export const COURSE_REQUIREMENTS = {
  passingScore: 70,
  questionsPerQuiz: 10,
  completionCriteria: {
    allLessonsCompleted: true,
    allQuizzesPassed: true,
    minimumOverallScore: 70
  }
};

// Course badge templates  
export const courseBadgeTemplates = BADGE_TEMPLATES;
