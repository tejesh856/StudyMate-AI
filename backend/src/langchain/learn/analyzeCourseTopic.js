// analyzeCourseTopic.js
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { model } from "../../lib/groqClient.js";

export const analyzeCourseTopic = async (topic) => {
  const schema = z.object({
  valid: z.boolean(),
  subject: z.enum([
    "Coding",
    "Math",
    "Physics",
    "Chemistry",
    "Biology",
    "Law",
    "Computer Science",
    "General Knowledge",
    "Other",
  ]),
  languageOrDomain: z.string().optional().nullable(), // ✅ FIXED
  reason: z.string().optional().nullable(),
});


  const parser = StructuredOutputParser.fromZodSchema(schema);

  const prompt = ChatPromptTemplate.fromTemplate(`

You are an intelligent AI assistant helping validate and categorize course topics.

You will receive a course topic. You must classify it and validate whether it's appropriate for building a structured learning course.

Return a JSON object with:
- "valid": true if the topic is specific and meaningful enough for a course.
- "subject": choose one subject area: Coding, Math, Physics, Chemistry, Biology, Law, Computer Science, General Knowledge, or Other.
- "languageOrDomain": (optional) the programming language, scientific domain, or topic focus (e.g., "JavaScript", "Organic Chemistry", "Calculus", "Indian Constitution"). Leave it out if not clear.
- "reason": (only if valid is false) a brief sentence explaining why the topic is invalid or unclear.

Classification Guidelines:
- ✅ “C++ Basics” → valid, subject: Coding, languageOrDomain: C++
- ✅ “Thermodynamics” → valid, subject: Physics, domain: Thermodynamics
- ✅ “Calculus” → valid, subject: Math
- ✅ “Indian Constitution” → valid, subject: Law
- ❌ “Programming” (too broad) → valid: false
- ❌ “Math” (too general) → valid: false
- ✅ “ReactJS” → valid, subject: Coding, languageOrDomain: JavaScript
- ✅ “Organic Chemistry” → valid, subject: Chemistry
- ❌ “asdfgh” → valid: false

Respond only with valid JSON. No markdown, no explanations outside the JSON.

Topic: {topic}

{format_instructions}
`);

  const chain = prompt.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
      topic,
      format_instructions: parser.getFormatInstructions(),
    });

    return result;
  } catch (error) {
    console.error("analyzeCourseTopic error:", error);
    return {
      valid: false,
      subject: "Other",
      reason: "Failed to analyze topic",
    };
  }
};
