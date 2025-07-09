// 📁 suggestions/generateDailySuggestions.js
import { StructuredOutputParser, OutputFixingParser } from "langchain/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { jsonrepair } from "jsonrepair";
import { model } from "../lib/groqClient.js";

const SuggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      type: z.enum(["reviewQuiz", "attemptQuiz", "newCourse"]),
      text: z.string(),
      link: z.string(),
      highlightText: z.string(),
      topic: z.string().optional(),
      description: z.string().optional(),
      difficulty: z.string().optional(),
      numofchapters: z.number().optional(),
      includeVideo: z.boolean().optional(),
    })
  )
});

const baseParser = StructuredOutputParser.fromZodSchema(SuggestionSchema);
const parser = OutputFixingParser.fromLLM(model, baseParser);

const prompt = ChatPromptTemplate.fromTemplate(`
You are an intelligent tutor assistant generating a list of 5–6 personalized learning suggestions for a student.

The student has:
- Enrolled in the following courses:
{courses}

- Attempted the following quizzes:
{quizAttempts}

Each suggestion must be one of:
1. "reviewQuiz" → Suggest reviewing a quiz they attempted (with link '/quiz/review/{{quizId}}')
2. "attemptQuiz" → Suggest taking a new quiz (with link '/quiz/attempt?topic={{topic}}&difficulty={{difficulty}}&numQuestions={{n}}')
3. "newCourse" → Suggest starting a new course (with link '/learn')

Return structured JSON with an array of suggestions. Each item must include:
- type ("reviewQuiz" | "attemptQuiz" | "newCourse")
- text (e.g., "Review your last quiz on Photosynthesis")
- link (URL path, e.g., "/quiz/review/65aa1234...")
- highlightText (e.g., "Photosynthesis")

For suggestions with "type": "newCourse", also include:
- topic: the course topic title
- description: short description of the course
- difficulty: one of ("beginner", "intermediate", "advanced")
- numofchapters: number of chapters (between 4 and 8)
- includeVideo: true or false, randomly chosen for variety

All link values must be valid URL paths. Encode spaces in links with '%20'.

Avoid markdown or commentary.
Return:
{formatInstructions}
`);



export const generateDailySuggestions = async ({ courses, quizAttempts, pastQuizzes }) => {
  const trimmedCourses = courses.slice(0, 5).map(course => ({
    title: course.topicTitle,
    subject: course.subject,
    difficulty: course.difficulty,
  }));

  const trimmedQuizzes = pastQuizzes.slice(0, 5).map(q => ({
    id: q.id,
    topic: q.topic,
    difficulty: q.difficulty,
  }));

  const chain = prompt.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
      courses: JSON.stringify(trimmedCourses, null, 2),
      quizAttempts: JSON.stringify(trimmedQuizzes, null, 2),
      formatInstructions: baseParser.getFormatInstructions(),
    });

    return result.suggestions;
  } catch (err) {
    console.warn("❌ Structured parser failed. Attempting JSON repair...", err);

    try {
      const rawOutput = err?.llmOutput ?? "";
      const repaired = jsonrepair(rawOutput);
      const parsed = JSON.parse(repaired);
      return SuggestionSchema.parse(parsed).suggestions;
    } catch (repairError) {
      console.error("❌ JSON repair failed:", repairError);
      throw new Error("Suggestion generation failed after repair attempt.");
    }
  }
};

