import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { model } from "../../lib/groqClient.js";

export const generateQuiz = async (
  context,
  isCoding,
  language,
  subject,
  numQuestions,
  difficulty
) => {
  const quizSchema = z.object({
    mcqs: z.array(
      z.object({
        question: z.string(),
        options: z.array(z.string()).length(4),
        answer: z.string(),
      })
    ),
    coding: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          inputFormat: z.string(),
          outputFormat: z.string(),
          constraints: z.string(),
          sampleInput: z.string(),
          sampleOutput: z.string(),
          testCases: z.array(
            z.object({
              input: z.string(),
              output: z.string(),
            })
          ),
        })
      )
      .optional(),
  });

  const parser = StructuredOutputParser.fromZodSchema(quizSchema);

  const prompt = ChatPromptTemplate.fromTemplate(`
You are an AI quiz generation assistant.

A student has submitted the following topic: "{context}"
Your task is to generate a quiz based on it. Carefully follow these instructions.

General Instructions:
- The difficulty level is: {difficulty}
- Total number of MCQs to generate: {numQuestions}.
${isCoding && !!language ? "- Also generate 1 coding question.\n" : ""}
- Return only VALID JSON (no markdown, comments, or explanations).

MCQ Instructions:
- Each MCQ must include:
  - "question": a clear question string
  - "options": an array of exactly 4 distinct answer strings
  - "answer": a string that matches one of the options exactly

${isCoding && !!language ? `Include 1 coding question with:
- "title": brief problem name
- "description": detailed description
- "inputFormat": description of input
- "outputFormat": description of output
- "constraints": time/space limits or rules
- "sampleInput": example input string
- "sampleOutput": output for sample input
- "testCases": array of at least 3 test cases with:
   - "input": string
   - "output": string
` : ""}

Output format must match this structure exactly:
{format_instructions}
`);


  const chain = prompt.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
      context,
      difficulty,
      numQuestions,
      format_instructions: parser.getFormatInstructions(),
      codingInstruction: isCoding && !!language
        ? `
Include 1 coding question with:
- "title": brief problem name
- "description": detailed description
- "inputFormat": description of input
- "outputFormat": description of output
- "constraints": time/space limits or rules
- "sampleInput": example input string
- "sampleOutput": output for sample input
- "testCases": array of at least 3 test cases with:
   - "input": string
   - "output": string
`
        : "",
    });

    return result;
  } catch (err) {
    console.error("Quiz generation failed:", err);
    return { mcqs: [], coding: [] };
  }
};
