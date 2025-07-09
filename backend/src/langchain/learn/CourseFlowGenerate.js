import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { model } from "../../lib/groqClient.js";

// 1. Define Zod schema for course flow
const courseFlowSchema = z.object({
  topicTitle: z.string(),
  chapters: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      includeVideo: z.boolean(),
      subChapters: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          includeVideo: z.boolean(),
        })
      ),
    })
  ),
});

// 2. Structured parser
const parser = StructuredOutputParser.fromZodSchema(courseFlowSchema);

// 3. Prompt template for course flow generation
const prompt = ChatPromptTemplate.fromTemplate(`

You are an AI tutor assistant helping students learn simple and complex courses.

Student wants to learn about: {topicPrompt}

Short description of their learning goal:
{description}

Subject: {subject}
Domain or Topic Focus: {domain}
Course Overall Difficulty Level: {difficulty}

Break this topic into {numofchapters} well-structured chapters (from basic to advanced).

Each chapter must include:
- A concise "title"
- A short "description" (2–3 lines)
- "includeVideo": {includeVideo}
- A list of subchapters (let the number vary based on chapter complexity)

Each subchapter must include:
- A specific "title" (focused topic)
- A short, helpful "description"
- "includeVideo": {includeVideo}

🧠 Instructions:
- Dynamically decide the number of subchapters based on the depth and scope of each chapter.
- Adjust chapter and subchapter detail level based on difficulty:
  - Beginner: Use simple, clear language and analogies.
  - Intermediate: Use examples and moderate technical depth.
  - Advanced: Include technical reasoning, detailed breakdowns, and advanced concepts.

📚 Use appropriate instructional style based on subject (e.g., theory for science, problem-solving for math, code for programming).

Strictly return valid JSON in the following format:
{format_instructions}
`);



// 4. Exported function
export const generateCourseFlow = async ({
  topicPrompt,
  description,
  difficulty,
  numofchapters,
  includeVideo,
  subject,
  domain=null
}) => {
  const chain = prompt.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
      topicPrompt,
      description,
      difficulty,
      numofchapters,
      includeVideo,
      subject,
      domain,
      format_instructions: parser.getFormatInstructions(),
    });

    return result;
  } catch (err) {
    console.error("❌ Course flow generation failed:", err);
    throw new Error("Failed to generate course flow");
  }
};

export const generateCourseDescription = async (topic) => {
  const descriptionSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
});

// 2. Structured output parser
const parser = StructuredOutputParser.fromZodSchema(descriptionSchema);

// 3. Prompt with format instructions
const descriptionPrompt = ChatPromptTemplate.fromTemplate(`
You are an AI assistant. Write a short and helpful course description (2–3 lines) for the topic: "{topic}"

Strictly return the output in the following JSON format:
{format_instructions}
`);

 const chain = descriptionPrompt.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
      topic,
      format_instructions: parser.getFormatInstructions(),
    });

    return result.description.trim(); // safely access description
  } catch (err) {
    console.error("❌ Failed to generate course description:", err);
    throw new Error("Course description generation failed.");
  }
};

