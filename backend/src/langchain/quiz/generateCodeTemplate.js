import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { model } from "../../lib/groqClient.js";

export const generateCodeTemplate = async (codingQuestion, language,version) => {
  const parser = new StringOutputParser();

  const prompt = ChatPromptTemplate.fromTemplate(`
You are an expert programming assistant.

Generate a starter code template in "{language}" version "{version}" for the following problem. The code must read all required inputs using standard input (stdin), using syntax that is supported in that language and version. The code should define a function with an appropriate name but must not include the full implementation.

Problem:
Title: {title}
Description: {description}
Input Format: {inputFormat}
Output Format: {outputFormat}
Constraints: {constraints}
Sample Input: {sampleInput}
Sample Output: {sampleOutput}

Instructions:
- Use only standard input (stdin) to read input — do not use hardcoded values.
- Ensure the stdin method is compatible with the given "{language}" and "{version}".
- Define a function using a name related to the title.
- Leave the function body empty with:
  - Python: \`pass\`
  - JavaScript: \`// write your code here\`
  - Java: \`// write your code here\`
  - C/C++: \`// write your code here\`
  - etc.
- After reading input, call the function and print the result using a print/log statement.
- Do not return markdown, explanation, Back Ticks or comments outside the code. Only return plain source code.
`);


  const chain = prompt.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
      title: codingQuestion.title,
      description: codingQuestion.description,
      inputFormat: codingQuestion.inputFormat,
      outputFormat: codingQuestion.outputFormat,
      constraints: codingQuestion.constraints,
      sampleInput: codingQuestion.sampleInput,
      sampleOutput: codingQuestion.sampleOutput,
      language,
      version
    });
    return result.trim();
  } catch (error) {
    console.error("Code template generation failed:", error);
    return "";
  }
};
