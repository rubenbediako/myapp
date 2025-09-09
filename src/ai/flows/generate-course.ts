
'use server';

/**
 * @fileOverview AI-powered course generation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CourseSubjectSchema = z.enum([
    "Microeconomics",
    "Macroeconomics",
    "Entrepreneurship",
    "International Trade",
    "Banking and Finance",
    "Banking Practices and Management",
    "Business Finance",
    "Labour Economics",
    "Educational Economics",
    "Financial Economics",
]);
export type CourseSubject = z.infer<typeof CourseSubjectSchema>;

const LessonSchema = z.object({
  lessonNumber: z.number().describe("The sequential number of the lesson within the entire course."),
  title: z.string().describe("The title of the lesson."),
  description: z.string().describe("A brief, one-sentence description of the lesson's content."),
});

const CoursePartSchema = z.object({
    partTitle: z.string().describe("The title of the course part (e.g., 'Introduction', 'Principles', 'Intermediate', 'Advanced')."),
    lessons: z.array(LessonSchema).describe("An array of lessons within this part of the course."),
});

const CourseSyllabusSchema = z.object({
  title: z.string().describe("The full title of the course."),
  description: z.string().describe("A detailed paragraph describing the course, its objectives, and what students will learn."),
  parts: z.array(CoursePartSchema).describe("An array of the four parts of the course."),
});
export type CourseSyllabus = z.infer<typeof CourseSyllabusSchema>;

const QuizQuestionSchema = z.object({
    question: z.string().describe("The quiz question, presented as a mini case-study or scenario."),
    options: z.array(z.string()).describe("An array of 4 multiple-choice options."),
    correctAnswer: z.string().describe("The correct answer from the options array."),
});

const LessonContentSchema = z.object({
  podcastScript: z.string().describe("A detailed, extensive, and in-depth podcast script for the lesson, with 'Rita:' as the host and 'Das:' as the expert tutor. It must be conversational, and follow a logical flow. Include detailed textual descriptions of graphs, equations, or images where they would help illustrate a point."),
  quiz: z.array(QuizQuestionSchema).describe("A multiple-choice quiz with 10 questions to test understanding of the lesson. Each question should be a scenario or case study based *only* on the concepts presented in the podcast script."),
  visualAidPrompt: z.string().optional().describe("A text prompt for a visual aid if one is described in the script."),
});
export type LessonContent = z.infer<typeof LessonContentSchema>;


export async function generateCourseSyllabus(subject: CourseSubject): Promise<CourseSyllabus> {
  const syllabusPrompt = ai.definePrompt({
    name: 'generateCourseSyllabusPrompt',
    input: { schema: z.object({ subject: CourseSubjectSchema }) },
    output: { schema: CourseSyllabusSchema },
    prompt: `You are Das, a world-class economist and professor designing a university-level course on {{{subject}}}. Your task is to create a complete and extensive course syllabus modeled after the high standards of MIT and Harvard's curricula.

The syllabus must include:
1.  A professional and engaging 'title' for the course.
2.  A detailed 'description' outlining the course objectives, what students will learn, and its real-world relevance.
3.  A structure of exactly four 'parts': 'Introduction', 'Principles', 'Intermediate', 'Advanced'.
4.  Each part must contain a comprehensive list of logically sequenced 'lessons'. The entire course should have a substantial number of lessons, making it as extensive as possible.
5.  Each lesson must have a sequential 'lessonNumber' (from 1 to N for the whole course), a clear 'title', and a concise 'description'.

The lesson topics should be comprehensive, rigorous, and reflect the depth and breadth of a top-tier university course on the subject.`,
  });

  const { output } = await syllabusPrompt({ subject });
  if (!output) {
    throw new Error('Failed to generate course syllabus.');
  }
  return output;
}

const generateLessonPrompt = ai.definePrompt({
    name: 'generateLessonPrompt',
    input: { schema: z.object({ subject: CourseSubjectSchema, lessonTitle: z.string() }) },
    output: { schema: LessonContentSchema },
    prompt: `You are Das, a world-class economist and professor, preparing a lesson for your course on {{{subject}}}. The specific lesson is titled: "{{{lessonTitle}}}".

Your task is to generate the full, extensive, and in-depth content for this single lesson. The process is:
1.  First, create the 'podcastScript'. This is a detailed, extensive podcast dialogue between Rita (host) and Das (expert tutor). It must be long enough to be about 5 minutes when spoken. It must thoroughly and deeply explain the core concepts of the lesson topic. 
2.  If the script would benefit from a visual aid (like a graph, chart, or diagram), you MUST include a detailed textual description of it within the script (e.g., "Das: Imagine a standard supply and demand graph..."). Then, you MUST provide a 'visualAidPrompt' string. This prompt should be a concise, clear instruction for an image generation AI to create that visual (e.g., "A clean, professional diagram of a supply and demand curve, showing the equilibrium point."). If no visual is needed, leave this field empty.
3.  Next, create the 'quiz'. It must be a multiple-choice quiz with exactly 10 questions. Each question must be a **scenario or case study** that tests the key concepts and facts presented *only* in the podcast script you just wrote.

The entire output (podcast and quiz) must be based *solely* on the information delivered within this single lesson. Do not introduce external topics. The content must be accurate, in-depth, and of university-level quality.`,
});


export const generateLessonContentFlow = ai.defineFlow(
    {
        name: 'generateLessonContentFlow',
        inputSchema: z.object({ subject: CourseSubjectSchema, lessonTitle: z.string() }),
        outputSchema: LessonContentSchema,
    },
    async ({ subject, lessonTitle }) => {
        const { output } = await generateLessonPrompt({ subject, lessonTitle });
        if (!output) {
            throw new Error('Failed to generate lesson content.');
        }
        return output;
    }
);
