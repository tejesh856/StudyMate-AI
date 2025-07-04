import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { model } from "../../lib/groqClient.js";

export const extractMainKeyword = async (topic) => {
  const schema = z.object({
    keyword: z.string()
  });

  const parser = StructuredOutputParser.fromZodSchema(schema);

  const prompt = ChatPromptTemplate.fromTemplate(`
You're a keyword extractor for quiz generation. A student provided this topic prompt: "{topic}".

Your task is to identify and return a single main keyword or concept that best represents the subject. This keyword will be used to generate a related image.

Rules:
- Keep it to 1-3 words
- No markdown, no explanation

Respond with JSON:
- keyword: the main concept

{format_instructions}
  `);

  const chain = prompt.pipe(model).pipe(parser);

  const result = await chain.invoke({
    topic,
    format_instructions: parser.getFormatInstructions(),
  });

  return result.keyword;
};
