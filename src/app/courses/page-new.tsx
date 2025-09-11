'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, BookOpen, Mic, Play, Users, Clock, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const courseSubjects = [
    { 
        id: 'microeconomics', 
        title: 'Microeconomics', 
        description: 'Understand individual and firm decision-making in resource allocation',
        level: 'Beginner',
        duration: '8 weeks',
        lessons: 24
    },
    { 
        id: 'macroeconomics', 
        title: 'Macroeconomics', 
        description: 'Analyze economy-wide phenomena and government policy impacts',
        level: 'Intermediate',
        duration: '10 weeks',
        lessons: 30
    },
    { 
        id: 'entrepreneurship', 
        title: 'Entrepreneurship', 
        description: 'Learn to design, launch, and scale successful business ventures',
        level: 'All Levels',
        duration: '12 weeks',
        lessons: 36
    },
    { 
        id: 'international-trade', 
        title: 'International Trade', 
        description: 'Explore global commerce, trade policies, and economic integration',
        level: 'Advanced',
        duration: '8 weeks',
        lessons: 24
    },
    { 
        id: 'banking-and-finance', 
        title: 'Banking and Finance', 
        description: 'Master financial systems, banking operations, and investment strategies',
        level: 'Intermediate',
        duration: '10 weeks',
        lessons: 30
    },
    { 
        id: 'business-finance', 
        title: 'Business Finance', 
        description: 'Corporate financial decision-making and investment analysis',
        level: 'Advanced',
        duration: '8 weeks',
        lessons: 24
    },
    { 
        id: 'labour-economics', 
        title: 'Labour Economics', 
        description: 'Analyze labor markets, employment, wages, and workplace dynamics',
        level: 'Intermediate',
        duration: '6 weeks',
        lessons: 18
    },
    { 
        id: 'development-economics', 
        title: 'Development Economics', 
        description: 'Economic growth, poverty reduction, and development strategies',
        level: 'Advanced',
        duration: '10 weeks',
        lessons: 30
    }
];

const learningPaths = [
    {
        id: 'economics-fundamentals',
        title: 'Economics Fundamentals',
        description: 'Complete foundation in economic principles',
        courses: ['microeconomics', 'macroeconomics', 'international-trade'],
        duration: '26 weeks'
    },
    {
        id: 'business-leadership',
        title: 'Business Leadership Track',
        description: 'Entrepreneurship and business management',
        courses: ['entrepreneurship', 'business-finance', 'banking-and-finance'],
        duration: '30 weeks'
    },
    {
        id: 'policy-analysis',
        title: 'Economic Policy Analysis',
        description: 'Government policy and economic development',
        courses: ['macroeconomics', 'labour-economics', 'development-economics'],
        duration: '26 weeks'
    }
];

export default function CoursesPage() {
    const { toast } = useToast();
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedPath, setSelectedPath] = useState<string>('');

    const getCourseContent = (courseId: string) => {
        const courseContents: { [key: string]: string } = {
            'microeconomics': `
                Microeconomics - Complete Course with Interactive Podcasts

                Course Introduction:
                Welcome to our comprehensive Microeconomics course, delivered through engaging podcast-style content with interactive elements, visual aids, and practical applications. This course will transform your understanding of how individuals and firms make economic decisions.

                Module 1: Introduction to Microeconomics
                - What is microeconomics and why it matters
                - Scarcity, opportunity cost, and trade-offs
                - Economic models and assumptions
                - Positive vs. normative economics
                - How economists think about behavior

                Module 2: Supply and Demand
                - The demand curve and factors affecting demand
                - The supply curve and determinants of supply
                - Market equilibrium and price determination
                - Consumer and producer surplus
                - Price elasticity of demand and supply

                Module 3: Consumer Theory
                - Utility theory and consumer preferences
                - Budget constraints and consumer choice
                - Income and substitution effects
                - Behavioral economics insights
                - Consumer decision-making in real markets

                Module 4: Production and Costs
                - Production functions and factors of production
                - Short-run vs. long-run production decisions
                - Cost concepts: fixed, variable, marginal, and average costs
                - Economies and diseconomies of scale
                - Technology and productivity

                Module 5: Market Structures
                - Perfect competition characteristics and outcomes
                - Monopoly power and price discrimination
                - Monopolistic competition and product differentiation
                - Oligopoly and strategic behavior
                - Game theory applications

                Module 6: Factor Markets
                - Labor market analysis and wage determination
                - Capital markets and interest rates
                - Land markets and economic rent
                - Income distribution and inequality
                - Human capital and education

                Module 7: Market Failures and Government Intervention
                - Externalities and their solutions
                - Public goods and common resources
                - Information asymmetries and market power
                - Government regulation and policy tools
                - Cost-benefit analysis

                Module 8: Welfare Economics
                - Economic efficiency and market outcomes
                - Pareto efficiency and social welfare
                - Equity vs. efficiency trade-offs
                - Policy evaluation frameworks
                - Real-world applications and case studies

                Course Features:
                - Interactive podcast lessons with expert explanations
                - Visual learning aids including graphs and charts
                - Real-world case studies and examples
                - Practice problems with step-by-step solutions
                - Assessment quizzes and knowledge checks
                - Discussion forums and peer interaction
                - Certificate of completion

                Learning Outcomes:
                By completing this course, you will be able to analyze consumer and producer behavior, understand market mechanisms, evaluate policy interventions, and apply microeconomic principles to real-world situations.
            `,
            'macroeconomics': `
                Macroeconomics - Advanced Course with Economic Analysis

                Course Introduction:
                This comprehensive Macroeconomics course explores economy-wide phenomena through podcast-based learning, combining theoretical frameworks with current economic events and policy analysis.

                Module 1: Introduction to Macroeconomics
                - Macroeconomic goals: growth, stability, and employment
                - Gross Domestic Product (GDP) and national accounting
                - Economic indicators and business cycles
                - Inflation, unemployment, and economic performance
                - International comparisons and development

                Module 2: Economic Growth and Development
                - Sources of economic growth: capital, labor, technology
                - Productivity and human capital
                - Innovation and technological progress
                - Sustainable development and environmental economics
                - Growth models and empirical evidence

                Module 3: Money and Banking
                - The role of money in the economy
                - Banking system and financial intermediation
                - Central banking and monetary policy
                - Interest rates and financial markets
                - Financial crises and systemic risk

                Module 4: Government and Fiscal Policy
                - Government spending, taxation, and budgets
                - Fiscal policy tools and multiplier effects
                - Public debt and deficit financing
                - Automatic stabilizers and discretionary policy
                - Political economy of fiscal decisions

                Module 5: International Economics
                - Balance of payments and exchange rates
                - International trade and comparative advantage
                - Capital flows and financial globalization
                - Trade policies and economic integration
                - Global economic institutions

                Module 6: Unemployment and Labor Markets
                - Types of unemployment and measurement
                - Labor market dynamics and job search
                - Wage determination and labor market institutions
                - Phillips curve and inflation-unemployment trade-offs
                - Policies to reduce unemployment

                Module 7: Inflation and Price Stability
                - Causes and consequences of inflation
                - Cost-push vs. demand-pull inflation
                - Expectations and inflation dynamics
                - Central bank independence and credibility
                - Deflation and low inflation environments

                Module 8: Economic Policy and Current Issues
                - Monetary and fiscal policy coordination
                - Economic crises and policy responses
                - Inequality and inclusive growth
                - Climate change and economic policy
                - Future challenges and opportunities

                Course Features:
                - Expert podcast discussions on current economic events
                - Data analysis and economic forecasting techniques
                - Policy simulation exercises
                - International case studies
                - Guest lectures from practicing economists
                - Research project opportunities
                - Professional development guidance

                Career Applications:
                This course prepares you for careers in economic analysis, policy development, financial services, consulting, journalism, and public service.
            `,
            'entrepreneurship': `
                Entrepreneurship - Complete Business Building Course

                Course Introduction:
                Transform your business ideas into reality with our comprehensive Entrepreneurship course, featuring podcast-style content, real-world case studies, and practical tools for building successful ventures.

                Module 1: Entrepreneurial Mindset
                - Identifying opportunities and market gaps
                - Creative thinking and innovation processes
                - Risk assessment and management
                - Entrepreneurial personality traits
                - Building resilience and persistence

                Module 2: Business Ideation and Validation
                - Idea generation techniques and brainstorming
                - Market research and customer discovery
                - Minimum viable product (MVP) development
                - Customer interviews and feedback collection
                - Pivot strategies and iteration

                Module 3: Business Model Design
                - Business model canvas and lean startup methodology
                - Value proposition design
                - Revenue models and pricing strategies
                - Customer segments and market positioning
                - Competitive analysis and differentiation

                Module 4: Financial Planning and Management
                - Startup financial planning and budgeting
                - Cash flow management and forecasting
                - Funding sources: bootstrapping, angel investors, venture capital
                - Financial statements and key performance indicators
                - Investment pitching and due diligence

                Module 5: Marketing and Customer Acquisition
                - Digital marketing strategies and channels
                - Brand building and positioning
                - Customer acquisition and retention strategies
                - Social media marketing and content creation
                - Sales processes and customer relationship management

                Module 6: Operations and Team Building
                - Operational planning and process design
                - Supply chain management and logistics
                - Hiring and team development
                - Leadership skills and company culture
                - Legal structures and compliance

                Module 7: Growth and Scaling
                - Growth hacking and expansion strategies
                - International market entry
                - Strategic partnerships and alliances
                - Technology adoption and automation
                - Exit strategies and succession planning

                Module 8: Innovation and Future Trends
                - Disruptive innovation and technology trends
                - Sustainable business practices
                - Social entrepreneurship and impact investing
                - Digital transformation and e-commerce
                - Future of work and business models

                Practical Components:
                - Business plan development workshop
                - Pitch preparation and practice sessions
                - Networking events and mentorship opportunities
                - Real startup case study analysis
                - Guest speakers from successful entrepreneurs
                - Capstone project with actual business launch

                Certification and Career Support:
                Complete the course to earn a verified certificate and access our alumni network, job placement assistance, and ongoing mentorship programs.
            `
        };

        return courseContents[courseId] || `
            ${courseSubjects.find(c => c.id === courseId)?.title} - Complete Course

            This comprehensive course covers all aspects of ${courseSubjects.find(c => c.id === courseId)?.title}, delivered through engaging podcast-style content with interactive elements and practical applications.

            The course is designed for ${courseSubjects.find(c => c.id === courseId)?.level} learners and includes real-world case studies, expert insights, and hands-on exercises to ensure deep understanding and practical application.

            Each module builds upon previous concepts while introducing new frameworks and tools that you can immediately apply in your studies or professional work.
        `;
    };

    const getPathContent = (pathId: string) => {
        const path = learningPaths.find(p => p.id === pathId);
        if (!path) return "";

        return `
            ${path.title} - Complete Learning Path

            Welcome to the ${path.title} learning path, a comprehensive educational journey designed to build expertise through ${path.duration} of structured, podcast-based learning.

            Learning Path Overview:
            ${path.description}

            This learning path combines multiple courses in a logical sequence, ensuring you build foundational knowledge before advancing to complex topics. Each course includes:

            - Interactive podcast lessons with expert instructors
            - Visual learning materials and practical exercises
            - Real-world case studies and applications
            - Assessment quizzes and progress tracking
            - Peer discussion and collaboration opportunities
            - Professional certification upon completion

            Included Courses:
            ${path.courses.map(courseId => {
                const course = courseSubjects.find(c => c.id === courseId);
                return `- ${course?.title}: ${course?.description}`;
            }).join('\n')}

            Career Outcomes:
            Graduates of this learning path are prepared for careers in economics, business analysis, policy development, consulting, and academic research. Our alumni network provides ongoing support and professional development opportunities.

            Flexible Learning:
            Study at your own pace with lifetime access to all materials. Download podcasts for offline learning and access materials from any device.

            Support and Community:
            Join a vibrant learning community with access to instructors, peer study groups, and professional networking opportunities.

            Get started today and transform your understanding of economics and business through our innovative podcast-first learning approach.
        `;
    };

    const podcastOptions = {
        generateAudio: true,
        audioPremium: true,
        includeMusic: true,
        voice: 'alloy' as const,
        includeVisuals: true,
        includeCharts: true,
        includeMath: true
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                    <GraduationCap className="inline-block w-8 h-8 mr-2 text-primary" />
                    Economics & Business Courses
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Master economics and business through our innovative podcast-first learning platform. Interactive content, expert instruction, and practical applications.
                </p>
                <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>15,000+ Students</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>Verified Certificates</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Self-Paced Learning</span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="courses" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="courses">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Individual Courses
                    </TabsTrigger>
                    <TabsTrigger value="paths">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Learning Paths
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="courses" className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select a Course to Preview</Label>
                            <Select onValueChange={setSelectedCourse} value={selectedCourse}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a course to see detailed content" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseSubjects.map(course => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.title} - {course.level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedCourse && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mic className="h-5 w-5" />
                                        {courseSubjects.find(c => c.id === selectedCourse)?.title} Course Preview
                                    </CardTitle>
                                    <CardDescription>
                                        Experience our podcast-first learning approach
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <UniversalPodcastPlayer
                                        title={`${courseSubjects.find(c => c.id === selectedCourse)?.title} - Complete Course`}
                                        content={getCourseContent(selectedCourse)}
                                        options={podcastOptions}
                                        autoGenerate={false}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courseSubjects.map((course) => (
                            <Card key={course.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{course.title}</CardTitle>
                                        <Badge variant={
                                            course.level === 'Beginner' ? 'default' :
                                            course.level === 'Intermediate' ? 'secondary' : 'destructive'
                                        }>
                                            {course.level}
                                        </Badge>
                                    </div>
                                    <CardDescription>{course.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>{course.duration}</span>
                                            <span>{course.lessons} lessons</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setSelectedCourse(course.id)}
                                                className="flex-1"
                                            >
                                                <Play className="w-4 h-4 mr-1" />
                                                Preview
                                            </Button>
                                            <Link href={`/courses/${course.id}`} className="flex-1">
                                                <Button size="sm" className="w-full">
                                                    Enroll Now
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="paths" className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select a Learning Path to Preview</Label>
                            <Select onValueChange={setSelectedPath} value={selectedPath}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a learning path to see detailed content" />
                                </SelectTrigger>
                                <SelectContent>
                                    {learningPaths.map(path => (
                                        <SelectItem key={path.id} value={path.id}>
                                            {path.title} - {path.duration}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedPath && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mic className="h-5 w-5" />
                                        {learningPaths.find(p => p.id === selectedPath)?.title} Learning Path
                                    </CardTitle>
                                    <CardDescription>
                                        Comprehensive educational journey with structured progression
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <UniversalPodcastPlayer
                                        title={`${learningPaths.find(p => p.id === selectedPath)?.title} - Complete Learning Path`}
                                        content={getPathContent(selectedPath)}
                                        options={podcastOptions}
                                        autoGenerate={false}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                        {learningPaths.map((path) => (
                            <Card key={path.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ArrowRight className="h-5 w-5" />
                                        {path.title}
                                    </CardTitle>
                                    <CardDescription>{path.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-medium">Duration:</span> {path.duration}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm">Included Courses:</h4>
                                            <div className="space-y-1">
                                                {path.courses.map(courseId => {
                                                    const course = courseSubjects.find(c => c.id === courseId);
                                                    return (
                                                        <div key={courseId} className="text-sm text-muted-foreground">
                                                            • {course?.title}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setSelectedPath(path.id)}
                                                className="flex-1"
                                            >
                                                <Play className="w-4 h-4 mr-1" />
                                                Preview Path
                                            </Button>
                                            <Button size="sm" className="flex-1">
                                                Start Learning
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle>Why Choose Our Podcast-First Learning?</CardTitle>
                    <CardDescription>
                        Experience the future of education with our innovative approach
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Mic className="h-8 w-8 text-primary" />
                            <h3 className="font-semibold">Audio-First Learning</h3>
                            <p className="text-sm text-muted-foreground">
                                Learn while commuting, exercising, or relaxing. Our high-quality audio content makes learning flexible and engaging.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <BookOpen className="h-8 w-8 text-primary" />
                            <h3 className="font-semibold">Interactive Content</h3>
                            <p className="text-sm text-muted-foreground">
                                Combined with visual aids, charts, and interactive exercises for comprehensive understanding.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Award className="h-8 w-8 text-primary" />
                            <h3 className="font-semibold">Expert Instruction</h3>
                            <p className="text-sm text-muted-foreground">
                                Learn from industry experts and academic leaders with real-world experience and insights.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
