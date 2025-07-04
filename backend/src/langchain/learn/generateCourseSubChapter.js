//import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { StructuredOutputParser,OutputFixingParser } from "langchain/output_parsers";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { model } from "../../lib/groqClient.js";
import { jsonrepair } from "jsonrepair"; // <== npm i jsonrepair


export const generateCourseSubChapter = async ({
  subChapters,
  includeVideo,
  difficulty,
  subject,          // Required
  domain = null,    // Optional
}) => {
  const studySchema = z.object({
    title: z.string(),
    description: z.string(),
    contentBlocks: z.array(
      z.object({
        type: z.enum(["text", "code"]),
        value: z.string(),
      })
    ),
    keyConcepts: z.array(z.string()),
    videoSuggestion: z.string().optional(),
  });
  const batchedSchema = z.array(studySchema);


  const baseparser = StructuredOutputParser.fromZodSchema(batchedSchema);
  const parser = OutputFixingParser.fromLLM(model,baseparser);

  const prompt = ChatPromptTemplate.fromTemplate(`

You are an AI tutor assistant generating structured Course study material for a list of subchapters for a student.

Subchapter Context:
- Subject: {subject}
- Domain or Topic Focus: ${domain || "Not specified"}
- Overall Difficulty Level: {difficulty}

Instructions:
1. Use the subject and domain to guide the nature and depth of explanations.
2. For each subchapter:
   - Carefully analyze the **title** and **description** to determine its content richness.
   - Adjust the **depth**, **length**, and **complexity** of the explanation based on:
     - The individual subchapter's topic and scope
     - The overall course difficulty:
       - Beginner: Use simple language, analogies, and clear real-life examples. Avoid technical jargon.
       - Intermediate: Introduce relevant terminology, provide deeper insights and practical reasoning.
       - Advanced: Include detailed theoretical explanations, equations or logic, technical vocabulary, and applications.
3. Each subchapter should contain **at least 4–8 contentBlocks**, or more if the topic demands.
4. For each subchapter, follow a structured teaching approach:
   - Start with foundational explanations
   - Use examples or code if necessary
   - Summarize the topic at the end

Content Block Format:
- "type": "text" for explanation, reasoning, or theory.
- "type": "code" ONLY IF truly helpful for:
  - Programming (JavaScript, Python, etc.)
  - Mathematics (LaTeX for formulas)
  - Physics (laws/derivations)
  - Chemistry (chemical equations)

Response Schema (array of subchapter materials):
Each item in the JSON array must include:
- "title": subchapter title
- "description": subchapter description
- "contentBlocks": an array of text/code blocks (minimum 4 per subchapter)
- "keyConcepts": 4–6 core takeaways
${includeVideo ? `- "videoSuggestion": Include one high-quality YouTube video URL that explains this topic well.` : ""}

Here is the list of subchapters to process:
{subChaptersJSON}

⚠️ Output STRICTLY valid JSON.
Do NOT include:
- Introductory text
- Markdown
- Backticks
- Extra explanation

Return only:
{format_instructions}

`);

  const chain = prompt.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
      subject,
      difficulty,
      domain,
      subChaptersJSON: JSON.stringify(subChapters, null, 2),
      format_instructions: baseparser.getFormatInstructions(),
    });

    return result;
  } catch (err) {
    console.warn("❌ Initial structured parse failed. Trying JSON repair...");

    try {
      const rawOutput = err?.llmOutput ?? "";
      const repaired = jsonrepair(rawOutput);
      return JSON.parse(repaired); // Validate later with `batchedSchema.safeParse`
    } catch (repairError) {
      console.error("❌ JSON repair failed:", repairError);
      throw new Error("Study material generation failed after retry");
    }
  }
};