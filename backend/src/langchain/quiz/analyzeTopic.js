import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { model } from "../../lib/groqClient.js";

export const analyzeTopic = async (topic) => {
  const schema = z.object({
    valid: z.boolean(),
    isCoding: z.boolean(),
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
    language: z.string().optional(),
    reason: z.string().optional(),
  });

  const parser = StructuredOutputParser.fromZodSchema(schema);

  const prompt = ChatPromptTemplate.fromTemplate(`
You are an intelligent AI quiz assistant. A student has submitted a topic for quiz generation.

You must:
1. Validate whether the topic is specific and meaningful enough for learning content.
2. Determine if it is coding-related.
3. Classify the appropriate subject.
4. Extract the specific programming language or scientific domain (if present).

Respond only in valid JSON. No markdown, no extra commentary.

Return:
- "valid": true/false
- "isCoding": true ONLY if it's clearly about programming
- "subject": one of [Coding, Math, Physics, Chemistry, Biology, Law, Computer Science, General Knowledge, Other]
- "language": (optional) e.g. "C++", "Calculus", "Organic Chemistry"
- "reason": (if valid is false)

📌 Examples:
- ✅ "C++ basics" → isCoding: true, language: C++, subject: Coding
- ✅ "Recursion in JavaScript" → isCoding: true, language: JavaScript, subject: Coding
- ❌ "DBMS" → isCoding: false, subject: Computer Science, language: DBMS
- ❌ "Operating Systems" → isCoding: false, subject: Computer Science, language: Operating Systems
- ✅ "Chemical Equations" → isCoding: false, subject: Chemistry, language: Chemical Equations
- ✅ "Trigonometry" → valid: true, isCoding: false, subject: Math, language: Trigonometry

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
    console.error("analyzeTopic error:", error);
    return {
      valid: false,
      isCoding: false,
      subject: "Other",
      reason: "Failed to analyze topic",
    };
  }
};
