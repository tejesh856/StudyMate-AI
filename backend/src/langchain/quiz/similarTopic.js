import { z } from "zod";
import Quiz from "../../models/quiz.model.js";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { model } from "../../lib/groqClient.js";

export const findSimilarQuizTopic = async (userTopic, studentId) => {
  const pastQuizzes = await Quiz.find({ studentId }, "topic image");

  const schema = z.object({
    sameTopic: z.boolean(),
    related: z.boolean(),
    reason: z.string(),
  });

  const parser = StructuredOutputParser.fromZodSchema(schema);

  const prompt = ChatPromptTemplate.fromTemplate(`
You are an expert in determining whether two technical quiz topics are the same or strongly related.

Return a valid JSON object with:
- "sameTopic": true if the topics are exactly the same or mean the same thing (even if phrased differently).
- "related": true if one topic is a subtopic, part, or concept under the other (e.g., "Promises" is a subtopic of "JavaScript").
- "reason": a short explanation (1 sentence max) justifying your answer (e.g., "Promises is a concept in JavaScript").

Only return valid JSON. No markdown or formatting.

Guidelines:
- ✅ “Promises” and “JavaScript” → related
- ✅ “React Lifecycle” and “ReactJS” → related
- ❌ “Operating Systems” and “JavaScript” → not related
- ❌ “Networking” and “Python” → not related

Topic 1: {topic1}  
Topic 2: {topic2}

{format_instructions}`);

  const chain = prompt.pipe(model).pipe(parser);

  for (const quiz of pastQuizzes) {
    const result = await chain.invoke({
      topic1: userTopic,
      topic2: quiz.topic,
      format_instructions: parser.getFormatInstructions(),
    });

    console.log("Comparison:", result);

    if (result.sameTopic || result.related) {
      return {
        topic: quiz.topic,
        image: quiz.image,
        reason: result.reason,
      };
    }
  }

  return null;
};