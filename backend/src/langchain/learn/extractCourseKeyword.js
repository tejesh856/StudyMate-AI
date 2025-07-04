import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { model } from "../../lib/groqClient.js";

export const extractCourseKeyword = async (topic) => {
  const schema = z.object({
    keyword: z.string()
  });

  const parser = StructuredOutputParser.fromZodSchema(schema);

  const prompt = ChatPromptTemplate.fromTemplate(`

You are an assistant that extracts the main concept or keyword from a course topic.

A student has given the course topic: "{topic}"

Your job is to identify and return the **single most important keyword or short phrase (1–3 words)** that best captures the essence of this course.

Rules:
- No explanation, no markdown, no comments
- Do not include the word "course" or "lesson"
- The keyword should be concise and suitable for generating an image or tag

Return this JSON structure:
- keyword: the main concept of the course

{format_instructions}
  `);

  const chain = prompt.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
      topic,
      format_instructions: parser.getFormatInstructions(),
    });

    return result.keyword;
  } catch (err) {
    console.error("❌ Failed to extract course keyword:", err);
    return null;
  }
};
