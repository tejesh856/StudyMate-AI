import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { model } from "../../lib/groqClient.js";
import Course from "../../models/Course.model.js";

export const findSimilarCourseTopic = async (userTopic, studentId) => {
  const pastCourses = await Course.find({ studentId }, "topicTitle");

  const schema = z.object({
    sameTopic: z.boolean(),
    related: z.boolean(),
    reason: z.string(),
  });

  const parser = StructuredOutputParser.fromZodSchema(schema);

  const prompt = ChatPromptTemplate.fromTemplate(`

You are an expert assistant determining whether two course topics are the same or closely related.

Return a valid JSON object with:
- "sameTopic": true if the topics are the same or essentially teach the same subject (even if phrased differently).
- "related": true if one topic is a clear subtopic or major concept inside the other.
- "reason": a brief sentence explaining the relationship (e.g., "React Hooks is a core concept within ReactJS").

Only output valid JSON. No markdown, formatting, or extra text.

Guidelines:
- ✅ “React Hooks” and “ReactJS” → related
- ✅ “Object-Oriented Programming” and “Java” → related
- ❌ “Data Structures” and “Web Development” → not related
- ❌ “Python” and “Networking” → not related

Topic 1: {topic1}  
Topic 2: {topic2}

{format_instructions}
`);

  const chain = prompt.pipe(model).pipe(parser);

  for (const course of pastCourses) {
    const result = await chain.invoke({
      topic1: userTopic,
      topic2: course.topicTitle,
      format_instructions: parser.getFormatInstructions(),
    });


    if (result.sameTopic || result.related) {
      return {
        topic: course.topicTitle,
        reason: result.reason,
      };
    }
  }

  return null;
};
