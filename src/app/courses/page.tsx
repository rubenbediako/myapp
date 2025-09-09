
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const courseSubjects = [
    { id: 'microeconomics', title: 'Microeconomics', description: 'Understand the behavior of individuals and firms in making decisions regarding the allocation of scarce resources.' },
    { id: 'macroeconomics', title: 'Macroeconomics', description: 'Analyze the performance, structure, behavior, and decision-making of an economy as a whole.' },
    { id: 'entrepreneurship', title: 'Entrepreneurship', description: 'Learn the process of designing, launching, and running a new business, which is often initially a small business.' },
    { id: 'international-trade', title: 'International Trade', description: 'Explore the exchange of capital, goods, and services across international borders or territories.' },
    { id: 'banking-and-finance', title: 'Banking and Finance', description: 'Delve into the study of money, banking, credit, investments, and assets and liabilities.' },
    { id: 'banking-practices', title: 'Banking Practices and Management', description: 'A deep dive into the operational and managerial aspects of modern banking institutions.' },
    { id: 'business-finance', title: 'Business Finance', description: 'Focuses on the financial decision-making within a corporation, including investment and financing.' },
    { id: 'labour-economics', title: 'Labour Economics', description: 'Analyzes the dynamics of the labor market, including wages, employment, and unions.' },
    { id: 'educational-economics', title: 'Educational Economics', description: 'Studies the economic issues related to education, including its funding and impact on productivity.' },
    { id: 'financial-economist', title: 'Financial Economics', description: 'Explores the interrelation of financial variables, such as prices, interest rates, and shares.' },
];

export default function CoursesPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();

    const handleCourseClick = (courseId: string) => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please sign in to access the AI courses.",
                variant: "destructive",
                action: <Button onClick={() => router.push('/sign-in')}>Sign In</Button>
            });
        } else {
            router.push(`/courses/${courseId}`);
        }
    };
    
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <GraduationCap className="h-16 w-16 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight">AI-Powered Courses</h1>
                <p className="max-w-3xl text-muted-foreground md:text-xl">
                    Welcome to The Economist's AI learning hub. Select a course below to start your journey. Each course is delivered by our AI tutor, Das, through a series of podcast-style lessons and assignments.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
                {courseSubjects.map((course) => (
                    <Card key={course.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-6 w-6" /> {course.title}
                            </CardTitle>
                            <CardDescription>{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                            <Button onClick={() => handleCourseClick(course.id)} className="w-full mt-4">
                                View Course <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
