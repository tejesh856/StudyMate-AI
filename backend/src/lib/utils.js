import jwt from "jsonwebtoken";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";
import Quiz from "../models/quiz.model.js";
import axios from "axios";
import { z } from 'zod';
dotenv.config({ path: `${process.cwd()}/.env` });

export const generateAuthToken = (userId, res) => {
  const payload = { userId };
  const secret = process.env.AUTH_SECRET;
  const expiresIn = "7d";

  // Generate the token
  const token = jwt.sign(payload, secret, { expiresIn });

  const isProduction = process.env.NODE_ENV === "production";


  // Send the token as a response (optional: store it in a cookie)
  res.cookie("authToken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });

  return token;
};
export const generateQuizToken = (quiz, res) => {
  console.log("Generating quiz token for quiz:", quiz._id);
  const payload = { quizId: quiz._id };
  const secret = process.env.QUIZ_SECRET;
  const expiresIn = "10m";

  // Generate the token
  const token = jwt.sign(payload, secret, { expiresIn });
  const isProduction = process.env.NODE_ENV === "production";
  // Send the token as a response (optional: store it in a cookie)
  res.cookie("quizToken", token, {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  res.cookie("quizId", String(quiz._id), {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return token;
};
export function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}
export const isJsonEqual = (a, b) => {
    try {
      const parsedA = JSON.parse(a);
      const parsedB = JSON.parse(b);
      return JSON.stringify(parsedA) === JSON.stringify(parsedB);
    } catch {
      return a.trim() === b.trim();
    }
  };
const batch = (arr, size) =>
  arr.reduce((acc, _, i) => (i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc), []);

export const enrichChapters = async (chapters, difficulty, subject, domain) => {
  const enrichedChapters = [];

  for (const chapter of chapters) {
    const subBatches = batch(chapter.subChapters, 5); // batch 5 at a time
    const enrichedSubChapters = [];

    for (const subBatch of subBatches) {
      const batchResult = await generateCourseSubChapter({
        subChapters: subBatch,
        difficulty,
        subject,
        domain,
      });

      for (let i = 0; i < subBatch.length; i++) {
        enrichedSubChapters.push({
          ...subBatch[i],
          studyMaterial: batchResult[i],
        });
      }
    }

    enrichedChapters.push({
      title: chapter.title,
      description: chapter.description,
      includeVideo: chapter.includeVideo,
      subChapters: enrichedSubChapters,
    });
  }

  return enrichedChapters;
};
/*const model = new ChatGroq({
  apiKey: process.env.GROQ_QUIZ_API_KEY,  
  model: "llama3-70b-8192",
  temperature: 0.2,
});

export const generateQuiz = async (context, isCoding, numQuestions = 3, difficulty = 'medium') => {
  const quizSchema = z.object({
    mcqs: z.array(z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      answer: z.string(),
    })),
    coding: z.array(z.object({
  title: z.string(),
  description: z.string(),
  inputFormat: z.string(),
  outputFormat: z.string(),
  constraints: z.string(),
  sampleInput: z.string(),
  sampleOutput: z.string(),
  testCases: z.array(z.object({
    input: z.string(),
    output: z.string(),
  }))
})).optional(),

  });

  const parser = StructuredOutputParser.fromZodSchema(quizSchema);

const prompt = ChatPromptTemplate.fromTemplate(`
You are a quiz generation assistant.

ONLY return valid JSON — no explanations, no markdown, no comments.

Content: {context}
Difficulty: {difficulty}
Number of questions: {numQuestions}
{codingInstruction}

Each MCQ must:
- Include exactly 4 string options
- Include an "answer" field that exactly matches one of the options
- Be syntactically valid JSON

{format_instructions}
`);


  const chain = prompt.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
    context,
    difficulty,
    numQuestions,
    format_instructions: parser.getFormatInstructions(),
    codingInstruction: isCoding
  ? `Also include 1 coding question with the following:
- title
- description
- inputFormat
- outputFormat
- constraints
- sampleInput
- sampleOutput
- testCases (at least 3) — each with an "input" and the expected "output".`
  : '',

  });
    return result;
  } catch (err) {
    console.error('Quiz generation failed:', err);
    return { mcqs: [], coding: [] };
  }
};


export const isValidQuizTopic = async (topic) => {
  const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    valid: z.boolean(),
    reason: z.string(),
  })
);
const prompt = ChatPromptTemplate.fromTemplate(`
You're a quiz topic evaluator. A user gives a topic. Your job is to determine if the topic is meaningful and suitable for generating a quiz.

{format_instructions}

Topic: {topic}
`);
const chain = prompt.pipe(model).pipe(parser);
  return await chain.invoke({
    topic,
    format_instructions: parser.getFormatInstructions(),
  });
};


export const isCodingQuizTopic = async (topic) => {
  const schema = z.object({
    isCoding: z.boolean(),
    reason: z.string()
  });

  const parser = StructuredOutputParser.fromZodSchema(schema);

  const prompt = ChatPromptTemplate.fromTemplate(`
    You are an AI tutor. A student has provided a topic: "{topic}".
    Your job is to determine whether this topic requires generating a coding-related quiz.
    Respond in JSON with:
    - isCoding: true if it is programming or CS-related, false otherwise
    - reason: a short explanation

    {format_instructions}
  `);

  const chain = prompt.pipe(model).pipe(parser);

  return await chain.invoke({
    topic,
    format_instructions: parser.getFormatInstructions()
  });
};
// utils/quizUtils.js
export const detectLanguageFromTopic = async (topic) => {
  const schema = z.object({
    language: z.string().optional(),
    reason: z.string()
  });

  const parser = StructuredOutputParser.fromZodSchema(schema);

  const prompt = ChatPromptTemplate.fromTemplate(`
You're a smart AI assistant. A student gives a topic: "{topic}"

Determine whether the topic clearly specifies a programming language.
If yes, return the detected language (like "javascript", "python", "c++", etc.).
If not, leave it undefined.

Respond in JSON with:
- language: (optional string)
- reason: explanation

{format_instructions}
  `);

  const chain = prompt.pipe(model).pipe(parser);

  return await chain.invoke({
    topic,
    format_instructions: parser.getFormatInstructions(),
  });
};

export const findSimilarQuizTopic = async (userTopic) => {
  const pastQuizzes = await Quiz.find({}, "topic image");

  const schema = z.object({
    sameTopic: z.boolean(),
    reason: z.string()
  });

  const parser = StructuredOutputParser.fromZodSchema(schema);

  const prompt = ChatPromptTemplate.fromTemplate(`
    You're an expert at determining whether two phrases refer to the same quiz topic.
    Compare the two topics and respond only with JSON including:
    - sameTopic: true or false
    - reason: short explanation

    {format_instructions}

    Topic 1: {topic1}
    Topic 2: {topic2}
  `);

  const chain = prompt.pipe(model).pipe(parser);

  for (const quiz of pastQuizzes) {
    const result = await chain.invoke({
      topic1: userTopic,
      topic2: quiz.topic,
      format_instructions: parser.getFormatInstructions(),
    });

    if (result.sameTopic) {
      return {
        topic: quiz.topic,
        image: quiz.image,
        reason: result.reason,
      };
    }
  }

  return null;// tweak threshold if needed
};*/
export const formatMMSS = (seconds) => {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
};
/*export async function runCodeWithPiston({ language, code, input }) {
  try {
    const match = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
    const fnName = match?.[1] || "main"; // fallback function name

    const wrappedCode = `
${code}
const input = ${input};
console.log(${fnName}(input));
`;
    const res = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: language,
      version: '1.32.3',
      files: [
        {
          content: wrappedCode,
        },
      ],
    });

    return {
      output: res.data.run.output?.trim(),
      success: true,
    };
  } catch (err) {
    return {
      output: err.message,
      success: false,
    };
  }
}*/
