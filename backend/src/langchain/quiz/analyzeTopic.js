// analyzeTopic.js
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { model } from "../../lib/groqClient.js";

export const analyzeTopic = async (topic) => {
  const schema = z.object({
    valid: z.boolean(),
    isCoding: z.boolean(),
    language: z.string().optional(),
    reason: z.string().optional(),
  });

  const parser = StructuredOutputParser.fromZodSchema(schema);

  const prompt = ChatPromptTemplate.fromTemplate(`
You are an intelligent AI quiz assistant. A student has typed a topic or a request for generating a quiz.

Return a JSON object with the following fields:
- "valid": true if the topic is clear, meaningful, and suitable for generating a quiz; otherwise false.
- "isCoding": true ONLY if the topic clearly relates to programming concepts, programming languages, or software development (e.g., data structures, algorithms, JavaScript, Python, etc.). False for general computer science topics.
- "language": (optional) the specific language mentioned (e.g., "JavaScript", "C++", "Python"). Leave it out if not explicitly clear.
- "reason": (only include if valid is false) Explain why the topic is invalid or unclear.

### Classification Guidelines:
- ✅ Treat topics like “C++ basics”, “Python functions”, “Recursion in Java” as coding-related with the relevant language.
- ❌ Treat topics like “Computer Fundamentals”, “Operating Systems”, “Networking”, “DBMS”, “Software Engineering”, “Computer Architecture” as non-coding topics.
- ❌ Do NOT assume a language unless it's clearly mentioned in the topic.
- ✅ Topics like “Promises” or “React lifecycle” imply JavaScript.
- ✅ Topics like “List comprehension” imply Python.

Only respond with valid JSON. No markdown, no extra explanation.

Topic: {topic}

{format_instructions}`);

  const chain = prompt.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
      topic,
      format_instructions: parser.getFormatInstructions(),
    });
    console.log("analyzeTopic result:", result);
    return result;
  } catch (error) {
    console.error("analyzeTopic error:", error);
    return {
      valid: false,
      isCoding: false,
      reason: "Failed to analyze topic",
    };
  }
};
