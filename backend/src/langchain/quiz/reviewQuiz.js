import { model as chatGroqModel } from '../../lib/groqClient.js';

export const reviewCoding = async (attempt) => {
  const feedback = [];
  const codingQuestions = attempt.quizId.coding || [];

  for (const coding of codingQuestions) {
    const userCode = attempt.codeAnswers?.[coding.title];
    if (!userCode) {
      feedback.push({
        questionId: coding._id,
        feedback: 'No code submitted.',
        correct: false,
      });
      continue;
    }

    const tcString = coding.testCases.map(tc => `Input: ${tc.input}\nExpected Output: ${tc.output}`).join('\n');

    const prompt = `You are reviewing a student's code.\n\nProblem: ${coding.title}\nDescription: ${coding.description}\nConstraints: ${coding.constraints}\nTest Cases:\n${tcString}\n\nStudent Solution:\n${userCode}\n\nTell whether this code is correct. If incorrect, state *only* the main topic or concept the student should review. Do not suggest websites or platforms. Keep it short.`;

    const aiReview = await chatGroqModel.invoke([
      { role: 'system', content: 'You are a senior software engineer reviewing student code.' },
      { role: 'user', content: prompt },
    ]);

    const response = aiReview.content.trim();
    const isCorrect = response.toLowerCase().includes('correct');

    feedback.push({
      questionId: coding._id,
      correct: isCorrect,
      feedback: response,
    });
  }

  return feedback;
};

export const reviewMCQ = async (attempt) => {
  const feedback = {};
  const mcqs = attempt.quizId.mcqs || [];

  for (const mcq of mcqs) {
    const userAnswer = attempt.mcqAnswers?.[mcq._id];
    const isCorrect = userAnswer === mcq.answer;

    if (!isCorrect && userAnswer) {
      const prompt = `Question: ${mcq.question}\nOptions: ${mcq.options.join(', ')}\nCorrect Answer: ${mcq.answer}\nUser Answer: ${userAnswer}\n
Give a very short explanation (1-2 lines) on why the selected answer is incorrect. Mention the concept if necessary. Do not suggest resources or write general advice.`;

      const explanation = await chatGroqModel.invoke([
        { role: 'system', content: 'You are an MCQ tutor giving minimal but precise feedback.' },
        { role: 'user', content: prompt },
      ]);

      feedback[mcq._id] = explanation.content.trim();
    }
  }

  return feedback;
};


export const generateOverallSuggestion = async (attempt, mcqFeedback, codingFeedback) => {
  const userName = attempt.userId?.name || 'the student';
  const topic = attempt.quizId.topic;

  const incorrectMcqs = Object.keys(mcqFeedback).length;
  const incorrectCodings = codingFeedback.filter(item => !item.correct).length;
  const totalMcqs = attempt.quizId.mcqs?.length || 0;
  const totalCodings = attempt.quizId.coding?.length || 0;

  const prompt = `Student: ${userName}\nTopic: ${topic}\nTotal MCQs: ${totalMcqs}, Incorrect MCQs: ${incorrectMcqs}\nTotal Coding: ${totalCodings}, Incorrect Coding: ${incorrectCodings}\n
Provide a short and personalized suggestion:\n- If all answers are correct, simply praise the student.\n- If there are mistakes, list only the key topics they should review based on where they made mistakes. No external resources or generic motivation.`;

  const response = await chatGroqModel.invoke([
    { role: 'system', content: 'You are an educational mentor giving concise, useful suggestions.' },
    { role: 'user', content: prompt },
  ]);

  return response.content.trim();
};

