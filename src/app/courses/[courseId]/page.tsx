
import UnderConstructionPage from '@/components/under-construction';

export default function CoursePage() {
  return (
    <UnderConstructionPage 
      title="Course Content"
      description="AI-powered course generation is being updated."
      backLink="/courses"
    />
  );
}
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    generateCourseSyllabus, 
    generateLessonContentFlow,
    CourseSubject, 
    CourseSyllabus,
    LessonContent
} from '@/ai/flows/generate-course';
import { generatePodcast } from '@/ai/flows/generate-podcast';
import { generateImage } from '@/ai/flows/generate-image';

type QuizState = {
    answers: Record<number, string>;
    submitted: boolean;
    score: number | null;
};

type Lesson = CourseSyllabus['parts'][0]['lessons'][0];

type GeneratedContent = LessonContent & {
    podcastUrl?: string;
    visualAidUrl?: string;
};

type LessonWithContent = Lesson & { 
    content?: GeneratedContent; 
    isGenerating?: boolean;
    quizState?: QuizState;
};

const courseIdToSubjectMap: Record<string, CourseSubject> = {
    'microeconomics': 'Microeconomics',
    'macroeconomics': 'Macroeconomics',
    'entrepreneurship': 'Entrepreneurship',
    'international-trade': 'International Trade',
    'banking-and-finance': 'Banking and Finance',
    'banking-practices': 'Banking Practices and Management',
    'business-finance': 'Business Finance',
    'labour-economics': 'Labour Economics',
    'educational-economics': 'Educational Economics',
    'financial-economist': 'Financial Economics',
};

const PASS_MARK = 70;

const PodcastLine = ({ speaker, text }: { speaker: string, text: string }) => {
    const speakerClass = speaker.includes('Rita') ? 'text-speaker-rita' : 'text-speaker-das';
    return <p className="text-muted-foreground text-base"><strong className={speakerClass}>{speaker}:</strong> {text}</p>;
};

const QuizComponent = ({ lesson, onQuizChange, onQuizSubmit }: { lesson: LessonWithContent, onQuizChange: (lessonNumber: number, questionIndex: number, answer: string) => void, onQuizSubmit: (lessonNumber: number) => void }) => {
    const { content, quizState } = lesson;
    const [quizActive, setQuizActive] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    if (!content?.quiz) return null;
    
    const currentQuestion = content.quiz[currentQuestionIndex];
    const totalQuestions = content.quiz.length;

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };
    
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (quizState?.submitted) {
        return (
            <div className="space-y-6">
                <div className={`p-4 rounded-lg text-center w-full sm:w-auto ${quizState.score !== null && quizState.score >= PASS_MARK ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <p className={`font-bold text-lg ${quizState.score !== null && quizState.score >= PASS_MARK ? 'text-green-700' : 'text-red-700'}`}>
                        Your Score: {quizState.score}%
                    </p>
                    {quizState.score !== null && quizState.score < PASS_MARK && <p className="text-sm text-red-700">Please review the lesson and try again. A score of {PASS_MARK}% is required to proceed.</p>}
                </div>
                {content.quiz.map((q, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${quizState.answers[index] === q.correctAnswer ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                        <p className="font-semibold mb-4 text-base">{index + 1}. {q.question}</p>
                        <RadioGroup value={quizState?.answers[index]} disabled>
                            {q.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`q${index}-o${oIndex}`} />
                                    <Label htmlFor={`q${index}-o${oIndex}`} className="flex-1 text-base">{option}</Label>
                                    {option === q.correctAnswer && <CheckCircle className="h-5 w-5 text-green-600" />}
                                    {quizState.answers[index] === option && option !== q.correctAnswer && <XCircle className="h-5 w-5 text-red-600" />}
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                ))}
            </div>
        );
    }

    if (!quizActive) {
        return (
            <div className="text-center">
                <Button onClick={() => setQuizActive(true)} size="lg">Take Quiz</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
                <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="mt-2" />
            </div>

            <div className="p-4 rounded-lg border bg-background">
                <p className="font-semibold mb-4 text-base">{currentQuestionIndex + 1}. {currentQuestion.question}</p>
                <RadioGroup
                    value={quizState?.answers[currentQuestionIndex]}
                    onValueChange={(value) => onQuizChange(lesson.lessonNumber, currentQuestionIndex, value)}
                >
                    {currentQuestion.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${oIndex}`} />
                            <Label htmlFor={`q${currentQuestionIndex}-o${oIndex}`} className="flex-1 text-base">{option}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <div className="flex items-center justify-between gap-4">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                
                {currentQuestionIndex === totalQuestions - 1 ? (
                    <Button onClick={() => onQuizSubmit(lesson.lessonNumber)}>
                        Submit Quiz
                    </Button>
                ) : (
                    <Button onClick={handleNext} disabled={currentQuestionIndex === totalQuestions - 1}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();
    const courseId = params.courseId as string;
    const subject = courseIdToSubjectMap[courseId];
    
    const [syllabus, setSyllabus] = useState<CourseSyllabus | null>(null);
    const [lessons, setLessons] = useState<LessonWithContent[]>([]);
    const [loadingSyllabus, setLoadingSyllabus] = useState(true);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [loadingLessonPdf, setLoadingLessonPdf] = useState(false);
    const [loadingBadgePdf, setLoadingBadgePdf] = useState(false);
    const certificateRef = useRef<HTMLDivElement>(null);
    const lessonPdfRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const [currentLessonNumber, setCurrentLessonNumber] = useState(1);
    
    const getProgressKey = useCallback(() => {
        if (!user || !courseId) return null;
        return `course-progress-${user.uid}-${courseId}`;
    }, [user, courseId]);


    useEffect(() => {
        if (!subject) {
            toast({ title: "Invalid Course", description: "This course does not exist.", variant: "destructive" });
            router.push('/courses');
            return;
        }

        const fetchSyllabus = async () => {
            setLoadingSyllabus(true);
            try {
                const result = await generateCourseSyllabus(subject);
                setSyllabus(result);
                const allLessons = result.parts.flatMap(p => p.lessons);
                
                const progressKey = getProgressKey();
                const savedProgressRaw = progressKey ? localStorage.getItem(progressKey) : null;

                if (savedProgressRaw) {
                    try {
                        const savedProgress = JSON.parse(savedProgressRaw);
                        const mergedLessons = allLessons.map(l => {
                            const savedLesson = savedProgress.lessonsProgress?.find((sl: any) => sl.lessonNumber === l.lessonNumber);
                            return {
                                ...l,
                                isGenerating: false,
                                quizState: savedLesson ? savedLesson.quizState : { answers: {}, submitted: false, score: null },
                            };
                        });
                        setLessons(mergedLessons);
                        setCurrentLessonNumber(savedProgress.currentLessonNumber || 1);
                    } catch (e) {
                         console.error("Failed to parse saved progress", e);
                         setLessons(allLessons.map(l => ({ 
                            ...l, 
                            isGenerating: false, 
                            quizState: { answers: {}, submitted: false, score: null },
                        })));
                    }
                } else {
                    setLessons(allLessons.map(l => ({ 
                        ...l, 
                        isGenerating: false, 
                        quizState: { answers: {}, submitted: false, score: null },
                    })));
                }

            } catch (error) {
                console.error("Error generating syllabus:", error);
                toast({ title: "Error", description: "Could not load the course syllabus. Please try again later.", variant: "destructive" });
            } finally {
                setLoadingSyllabus(false);
            }
        };

        if(user) fetchSyllabus();
    }, [subject, router, toast, user, getProgressKey]);
    
    
    useEffect(() => {
        const progressKey = getProgressKey();
        if (progressKey && lessons.length > 0) {
            const progressToSave = {
                lessonsProgress: lessons.map(l => ({
                    lessonNumber: l.lessonNumber,
                    quizState: l.quizState,
                })),
                currentLessonNumber,
            };
            localStorage.setItem(progressKey, JSON.stringify(progressToSave));
        }
    }, [lessons, currentLessonNumber, getProgressKey]);

    const handleGenerateLesson = useCallback(async (lessonNumber: number) => {
        const lessonIndex = lessons.findIndex(l => l.lessonNumber === lessonNumber);
        if (lessonIndex === -1 || lessons[lessonIndex].isGenerating || lessons[lessonIndex].content) return;

        setLessons(prev => prev.map(l => l.lessonNumber === lessonNumber ? { ...l, isGenerating: true } : l));

        try {
            const lesson = lessons[lessonIndex];
            const lessonContent = await generateLessonContentFlow({subject, lessonTitle: lesson.title});
            
            // Now generate podcast and image in parallel
            const podcastPromise = generatePodcast({ 
                title: lesson.title, 
                narrationScript: lessonContent.podcastScript 
            });

            const imagePromise = lessonContent.visualAidPrompt 
                ? generateImage({ prompt: lessonContent.visualAidPrompt })
                : Promise.resolve(null);

            const [podcastResult, imageResult] = await Promise.all([podcastPromise, imagePromise]);

            const finalContent: GeneratedContent = {
                ...lessonContent,
                podcastUrl: podcastResult.audioUrl,
                visualAidUrl: imageResult?.imageUrl,
            };
            
            setLessons(prev => prev.map(l => l.lessonNumber === lessonNumber ? { ...l, content: finalContent, isGenerating: false } : l));
        } catch (error) {
            console.error(`Error generating lesson ${lessonNumber}:`, error);
            toast({ title: "Error", description: `Could not generate lesson ${lessonNumber}. Please try again.`, variant: "destructive" });
            setLessons(prev => prev.map(l => l.lessonNumber === lessonNumber ? { ...l, isGenerating: false } : l));
        }
    }, [lessons, subject, toast]);
    
    const handleQuizChange = (lessonNumber: number, questionIndex: number, answer: string) => {
        setLessons(prev => prev.map(l => {
            if (l.lessonNumber === lessonNumber && l.quizState) {
                const newAnswers = { ...l.quizState.answers, [questionIndex]: answer };
                return { ...l, quizState: { ...l.quizState, answers: newAnswers } };
            }
            return l;
        }));
    };
    
    const handleQuizSubmit = (lessonNumber: number) => {
        setLessons(prev => prev.map(l => {
            if (l.lessonNumber === lessonNumber && l.content?.quiz && l.quizState) {
                const correctAnswers = l.content.quiz.filter((q, index) => q.correctAnswer === l.quizState?.answers[index]).length;
                const score = Math.round((correctAnswers / l.content.quiz.length) * 100);
                toast({
                    title: `Quiz Submitted! Score: ${score}%`,
                    description: score >= PASS_MARK ? "Great job! You can now proceed." : `You need ${PASS_MARK}% to pass. Please review the lesson and try again.`,
                    variant: score >= PASS_MARK ? "default" : "destructive"
                });
                return { ...l, quizState: { ...l.quizState, submitted: true, score } };
            }
            return l;
        }));
    };
    
    const handleDownloadCertificate = async () => {
        const input = certificateRef.current;
        if (!input) {
            toast({ title: "Error", description: "Certificate template not found.", variant: "destructive" });
            return;
        }

        setLoadingPdf(true);
        try {
            const canvas = await html2canvas(input, { scale: 2, backgroundColor: null });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${user?.displayName || 'Student'}_${subject}_Certificate.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast({ title: "PDF Generation Error", description: "Could not generate certificate PDF.", variant: "destructive" });
        } finally {
            setLoadingPdf(false);
        }
    };

    const handleDownloadLessonPdf = async () => {
        const input = lessonPdfRef.current;
        if (!input || !currentLesson) {
            toast({ title: "Error", description: "Lesson content not found.", variant: "destructive" });
            return;
        }

        setLoadingLessonPdf(true);
        try {
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); // portrait
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Lesson_${currentLesson.lessonNumber}_${currentLesson.title.replace(/ /g, '_')}.pdf`);
        } catch (error) {
            console.error("Error generating lesson PDF:", error);
            toast({ title: "PDF Generation Error", description: "Could not generate lesson PDF.", variant: "destructive" });
        } finally {
            setLoadingLessonPdf(false);
        }
    };
    
    const handleDownloadBadge = async () => {
        const input = badgeRef.current;
        if (!input || !currentLesson) {
            toast({ title: "Error", description: "Badge template not found.", variant: "destructive" });
            return;
        }

        setLoadingBadgePdf(true);
        try {
            const canvas = await html2canvas(input, { scale: 2, backgroundColor: null, width: 500, height: 500 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', [132, 132]); // Square format
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Lesson_${currentLesson.lessonNumber}_Badge.pdf`);
        } catch (error) {
            console.error("Error generating badge PDF:", error);
            toast({ title: "PDF Generation Error", description: "Could not generate badge PDF.", variant: "destructive" });
        } finally {
            setLoadingBadgePdf(false);
        }
    };

    const isLessonPassed = (lesson: LessonWithContent | undefined): boolean => {
        if (!lesson) return false;
        return lesson.quizState?.score !== null && lesson.quizState.score >= PASS_MARK;
    };
    
    const handleLessonSelect = (lessonNumber: number) => {
        const previousLesson = lessons.find(l => l.lessonNumber === lessonNumber - 1);
        const isPreviousPassed = lessonNumber === 1 || isLessonPassed(previousLesson);

        if (isPreviousPassed) {
            setCurrentLessonNumber(lessonNumber);
            if (!lessons.find(l => l.lessonNumber === lessonNumber)?.content) {
                handleGenerateLesson(lessonNumber);
            }
        } else {
            toast({
                title: "Lesson Locked",
                description: `You must pass the quiz for Lesson ${lessonNumber - 1} to unlock this lesson.`,
                variant: "destructive"
            });
        }
    };
    
    const currentLesson = lessons.find(l => l.lessonNumber === currentLessonNumber);
    const completedLessons = lessons.filter(l => isLessonPassed(l)).length;
    const courseProgress = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;
    
    if (loadingSyllabus) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 flex flex-col items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-muted-foreground mt-4">Generating your course syllabus...</p>
            </div>
        );
    }
    
    if (!syllabus) {
        return (
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 flex flex-col items-center justify-center">
                <p className="text-destructive">Failed to load course. Please try again later.</p>
                <Button onClick={() => router.push('/courses')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
                </Button>
            </div>
        )
    }
    
    const isCourseCompleted = courseProgress === 100;

    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Button variant="outline" onClick={() => router.push('/courses')} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
                </Button>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold">{syllabus.title}</CardTitle>
                        <CardDescription className="text-lg text-muted-foreground">{syllabus.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                             <Label>Course Progress</Label>
                             <Progress value={courseProgress} className="w-full" />
                             <p className="text-sm text-muted-foreground">{completedLessons} of {lessons.length} lessons completed.</p>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                           <Button onClick={handleDownloadCertificate} disabled={loadingPdf || !isCourseCompleted}>
                                {loadingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Award className="mr-2 h-4 w-4" />}
                                {loadingPdf ? 'Generating...' : 'Generate Certificate'}
                           </Button>
                           {!isCourseCompleted && <p className="text-sm text-muted-foreground self-center">Complete all lessons to generate your certificate.</p>}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Lessons Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Curriculum</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-96 pr-4">
                                <Accordion type="multiple" defaultValue={syllabus.parts.map(p => p.partTitle)} className="w-full">
                                    {syllabus.parts.map((part) => (
                                        <AccordionItem key={part.partTitle} value={part.partTitle}>
                                            <AccordionTrigger className="text-lg font-semibold">{part.partTitle}</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-2">
                                                    {part.lessons.map((lesson) => {
                                                        const fullLesson = lessons.find(l => l.lessonNumber === lesson.lessonNumber);
                                                        const isUnlocked = lesson.lessonNumber === 1 || isLessonPassed(lessons.find(l => l.lessonNumber === lesson.lessonNumber - 1));
                                                        const isCompleted = isLessonPassed(fullLesson);

                                                        return (
                                                            <button
                                                                key={lesson.lessonNumber}
                                                                onClick={() => handleLessonSelect(lesson.lessonNumber)}
                                                                disabled={!isUnlocked}
                                                                className={cn(
                                                                    "w-full text-left p-3 rounded-md transition-colors flex items-center gap-3",
                                                                    !isUnlocked && "cursor-not-allowed opacity-60",
                                                                    isUnlocked && "hover:bg-accent",
                                                                    currentLessonNumber === lesson.lessonNumber && "bg-accent"
                                                                )}
                                                            >
                                                                <div className="flex-shrink-0">
                                                                    {isCompleted ? <CheckCircle className="h-5 w-5 text-green-500" /> : !isUnlocked ? <Lock className="h-5 w-5 text-muted-foreground" /> : <div className="h-5 w-5 rounded-full border-2 border-primary" />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold">Lesson {lesson.lessonNumber}</p>
                                                                    <p className="text-sm text-muted-foreground">{lesson.title}</p>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Lesson Content */}
                    <div className="lg:col-span-3">
                        {currentLesson ? (
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div>
                                            <CardTitle>Lesson {currentLesson.lessonNumber}: {currentLesson.title}</CardTitle>
                                            <CardDescription>{currentLesson.description}</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleDownloadBadge}
                                                disabled={loadingBadgePdf || !isLessonPassed(currentLesson)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                {loadingBadgePdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BadgeCheck className="mr-2 h-4 w-4" />}
                                                Download Badge
                                            </Button>
                                            <Button
                                                onClick={handleDownloadLessonPdf}
                                                disabled={loadingLessonPdf || !currentLesson.content}
                                                variant="outline"
                                                size="sm"
                                            >
                                                {loadingLessonPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                                Download PDF
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 bg-muted/50 rounded-b-lg">
                                    {currentLesson.isGenerating ? (
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground h-40">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Das is preparing your lesson...</span>
                                        </div>
                                    ) : currentLesson.content ? (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="font-semibold text-xl mb-2 flex items-center gap-2"><Mic /> Podcast Lesson</h3>
                                                {currentLesson.content.podcastUrl && (
                                                     <audio controls src={currentLesson.content.podcastUrl} className="w-full">Your browser does not support the audio element.</audio>
                                                )}
                                                <Accordion type="single" collapsible className="w-full mt-2">
                                                    <AccordionItem value="transcript">
                                                        <AccordionTrigger className="text-sm">View Full Transcript</AccordionTrigger>
                                                        <AccordionContent className="space-y-2 text-base max-h-60 overflow-y-auto pr-4">
                                                            {currentLesson.content.podcastScript.split('\n').filter(line => line.trim()).map((line, index) => (
                                                                <PodcastLine key={index} speaker={line.startsWith('Rita:') ? 'Rita' : 'Das'} text={line.substring(line.indexOf(':') + 1)} />
                                                            ))}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            </div>

                                            {currentLesson.content.visualAidUrl && (
                                                <div>
                                                    <h3 className="font-semibold text-xl mb-2 flex items-center gap-2"><ImageIcon /> Visual Aid</h3>
                                                    <div className="flex flex-col items-center bg-background p-4 rounded-lg">
                                                        <Image 
                                                            src={currentLesson.content.visualAidUrl}
                                                            alt={currentLesson.title}
                                                            width={500}
                                                            height={500}
                                                            className="rounded-lg object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div>
                                                <h3 className="font-semibold text-xl mb-2 flex items-center gap-2"><Percent /> Lesson Quiz</h3>
                                                 <QuizComponent 
                                                    lesson={currentLesson} 
                                                    onQuizChange={handleQuizChange} 
                                                    onQuizSubmit={handleQuizSubmit} 
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center p-8 h-40">
                                            <p className="text-muted-foreground mb-4">Click the button to start the lesson.</p>
                                            <Button onClick={() => handleGenerateLesson(currentLesson.lessonNumber)} disabled={currentLesson.isGenerating}>
                                                <Wand2 className="mr-2 h-4 w-4" /> Start Lesson {currentLesson.lessonNumber}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                             <div className="flex items-center justify-center text-muted-foreground h-full">
                                <p>Select a lesson from the left to get started.</p>
                             </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Hidden divs for PDF generation */}
            <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
                <div ref={certificateRef} className="p-10 bg-white text-black" style={{ width: '297mm', height: '210mm', backgroundImage: 'url(https://picsum.photos/seed/certificate-bg/1123/794)', backgroundSize: 'cover' }}>
                    <div className="w-full h-full border-4 border-yellow-600 p-8 flex flex-col items-center justify-center text-center bg-white bg-opacity-80">
                         <div className="flex items-center gap-4">
                            <Award className="h-20 w-20 text-yellow-700" />
                            <div>
                                <h1 className="text-6xl font-bold text-gray-800" style={{ fontFamily: "'Garamond', serif" }}>
                                    Certificate of Completion
                                </h1>
                                <p className="text-2xl text-gray-600 mt-2">This certificate is proudly presented to</p>
                            </div>
                        </div>

                        <div className="my-12">
                            <h2 className="text-5xl font-semibold text-primary" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                                {user?.displayName || "Valued Student"}
                            </h2>
                            <div className="w-1/2 h-0.5 bg-gray-400 mx-auto mt-2"></div>
                        </div>
                        
                        <p className="text-2xl text-gray-600">for successfully completing the course</p>
                        <h3 className="text-4xl font-semibold text-gray-800 mt-4" style={{ fontFamily: "'Garamond', serif" }}>
                           {syllabus?.title}
                        </h3>

                        <div className="mt-20 flex justify-between w-full">
                            <div className="text-center">
                                <p className="text-xl font-bold" style={{ fontFamily: "'Brush Script MT', cursive" }}>Das, AI Tutor</p>
                                <div className="w-48 h-0.5 bg-gray-400 mx-auto mt-1"></div>
                                <p className="text-sm text-gray-500">Lead Instructor</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg">{new Date().toLocaleDateString()}</p>
                                 <div className="w-32 h-0.5 bg-gray-400 mx-auto mt-1"></div>
                                <p className="text-sm text-gray-500">Date Issued</p>
                            </div>
                        </div>
                    </div>
                </div>
                 <div ref={badgeRef} className="p-4 bg-white text-black" style={{ width: '500px', height: '500px', backgroundImage: 'url(https://picsum.photos/seed/badge-bg/500/500)', backgroundSize: 'cover' }}>
                     <div className="w-full h-full border-4 border-blue-700 p-4 flex flex-col items-center justify-center text-center bg-white bg-opacity-80 rounded-full">
                        <BadgeCheck className="h-20 w-20 text-blue-700" />
                        <h2 className="text-3xl font-bold text-gray-800 mt-4">Lesson Complete</h2>
                        <p className="text-lg text-gray-600 mt-2">This acknowledges that</p>
                        <p className="text-2xl font-semibold text-primary mt-4" style={{ fontFamily: "'Garamond', serif" }}>
                            {user?.displayName || "Valued Student"}
                        </p>
                        <p className="text-lg text-gray-600 mt-4">has successfully passed</p>
                        <p className="text-xl font-bold text-gray-800 mt-2 text-center">
                           Lesson {currentLesson?.lessonNumber}: {currentLesson?.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-8">Issued on: {new Date().toLocaleDateString()}</p>
                     </div>
                </div>
                {currentLesson?.content && (
                     <div ref={lessonPdfRef} className="bg-white text-black p-8" style={{ width: '210mm' }}>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">{syllabus?.title}</h1>
                            <h2 className="text-2xl font-semibold text-gray-600 mt-2">Lesson {currentLesson.lessonNumber}: {currentLesson.title}</h2>
                        </div>
                        <div className="space-y-6">
                             {currentLesson.content.visualAidUrl && (
                                <div>
                                    <h3 className="text-xl font-bold border-b pb-2 mb-2 text-gray-800">Visual Aid</h3>
                                    <div className="flex flex-col items-center p-4">
                                        <img 
                                            src={currentLesson.content.visualAidUrl}
                                            alt={currentLesson.title}
                                            style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                                        />
                                    </div>
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-bold border-b pb-2 mb-2 text-gray-800">Lesson Transcript</h3>
                                <div className="space-y-2 text-base text-gray-700">
                                {currentLesson.content.podcastScript.split('\n').filter(line => line.trim()).map((line, index) => {
                                    const isRita = line.startsWith('Rita:');
                                    const speaker = isRita ? 'Rita' : 'Das';
                                    const dialogue = line.substring(line.indexOf(':') + 1);
                                    return <p key={index}><strong>{speaker}:</strong>{dialogue}</p>;
                                })}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-xl font-bold border-b pb-2 mb-2 text-gray-800">Lesson Quiz</h3>
                                <div className="space-y-4">
                                {currentLesson.content.quiz.map((q, index) => (
                                    <div key={index} className="text-base">
                                        <p className="font-semibold">{index + 1}. {q.question}</p>
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                            {q.options.map((option, oIndex) => (
                                                <li key={oIndex}>{option}</li>
                                            ))}
                                        </ul>
                                        <p className="font-medium mt-1">Correct Answer: {q.correctAnswer}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
