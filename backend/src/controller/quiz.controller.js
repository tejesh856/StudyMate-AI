import Quiz from '../models/quiz.model.js';
import { generateQuizToken } from '../lib/utils.js';
import quizAttempt from '../models/quizAttempt.model.js';
import QuizConversation from '../models/quizConversation.model.js';
import { analyzeTopic } from '../langchain/quiz/analyzeTopic.js';
import { findSimilarQuizTopic } from '../langchain/quiz/similarTopic.js';
import { generateQuiz } from '../langchain/quiz/generateQuiz.js';
import { extractMainKeyword } from '../langchain/quiz/extractKeyword.js';
import { CodeLanguages } from '../services/codeLangages.js';
import { generateCodeTemplate } from '../langchain/quiz/generateCodeTemplate.js';
import { generateImageFromTopic } from '../services/imageGeneration.js';
import { generateOverallSuggestion, reviewCoding, reviewMCQ } from '../langchain/quiz/reviewQuiz.js';
import createError from 'http-errors';

export const QuizGenerate = async (req, res, next) => {
  try {
    const { topic, difficulty = 'medium', numQuestions = 3 } = req.body;

    if (!topic || topic.trim() === '') {
      throw createError(400, `Topic is required`)
      //return res.status(400).json({ success: false, message: 'Topic is required' });
    }

    const trimmedTopic = topic.trim();
    const studentId = req.user._id;

    // 🔍 Analyze topic
    const analysis = await analyzeTopic(trimmedTopic);
    if (!analysis.valid) {
      throw createError(400, `Invalid topic: ${analysis.reason || 'unknown reason'}`)
      /*return res.status(400).json({
        success: false,
        message: `Invalid topic: ${analysis.reason || 'unknown reason'}`,
      });*/
    }

    const isCoding = analysis.isCoding === true;
    const language = analysis.language?.trim() || null;

    // 🖼️ Check for image from similar topic
    let matchedImage = null;
    if (isCoding || language) {
      const matchedQuiz = await findSimilarQuizTopic(trimmedTopic, studentId);
      if (matchedQuiz) {
        matchedImage = matchedQuiz.image;
      }
    }

    // 🌟 If no matched image, fallback to keyword-based generation
    const imagePrompt = language || await extractMainKeyword(trimmedTopic);
    
    const prompt = `A modern, colorful banner with the title '${imagePrompt.toUpperCase()}' in large, bold, centered text. Design should reflect the topic — use digital screens for coding topics, math symbols for math, gavels or books for law. Make it visually clear and suitable for a quiz card.`;
    const quizImage = matchedImage || await generateImageFromTopic(imagePrompt,prompt,true);

    // 🧠 Generate quiz content
    const quiz = await generateQuiz(trimmedTopic, isCoding, language, numQuestions, difficulty);

    let languageList = [];
    let codeTemplates = [];

    // 🧑‍💻 Prepare coding environment if coding is required
    if (isCoding && language) {
      const langs = await CodeLanguages(language);
      languageList = langs.output;

      if (quiz.coding?.length > 0 && languageList.length > 0) {
        const codingQuestion = quiz.coding[0];
        const firstLang = languageList[0];

        const template = await generateCodeTemplate(
          {
            title: codingQuestion.title,
            description: codingQuestion.description,
            inputFormat: codingQuestion.inputFormat,
            outputFormat: codingQuestion.outputFormat,
            constraints: codingQuestion.constraints,
            sampleInput: codingQuestion.sampleInput,
            sampleOutput: codingQuestion.sampleOutput,
          },
          firstLang.language,
          firstLang.version
        );

        codeTemplates.push({
          language: firstLang.language,
          version: firstLang.version,
          template,
        });
      }
    }

    // 💾 Save quiz
    const savedQuiz = await Quiz.create({
      studentId,
      topic: trimmedTopic,
      difficulty,
      numQuestions,
      type: 'text',
      mcqs: quiz.mcqs,
      coding: quiz.coding || [],
      image: quizImage,
      codeTemplates,
      codingLanguages: languageList,
    });

    // 💬 Log conversation
    await QuizConversation.create({
      studentId,
      input: { topic: trimmedTopic, difficulty, numQuestions },
      output: quiz,
      isCoding,
    });

    generateQuizToken(savedQuiz, res);
    res.status(200).json({
      success: true,
      message: 'Quiz generated successfully',
      quiz: savedQuiz,
      attempt: null,
      codingLanguages: languageList,
    });
  } catch (err) {
    console.error('Quiz generation error:', err);
    next(err);
  }
};



export const GetPastQuizzes = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const start = Date.now();
    const quizzes = await Quiz.find({ studentId }).sort({ createdAt: -1 });
    const end = Date.now();

    console.log(`⏱️ Quiz fetch time: ${end - start}ms`);


    res.json({ success: true, quizzes });
  } catch (err) {
    next(err);
  }
};
export const ReviewQuizAttempt = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const attempts = await quizAttempt.find({ quizId }).populate('quizId').populate('userId', 'name email').sort({ submittedAt: -1 });
    console.log('attempts',attempts);
    if (!attempts || attempts.length === 0) {
      throw createError(400, `No attempts found for this quiz'}`)
      //return res.status(404).json({ success: false, message: 'No attempts found for this quiz' });
    }
    const attempt = attempts[0];
const hasReview =
  attempt.review &&
  Array.isArray(attempt.review.codingFeedback) &&
  attempt.review.codingFeedback.length > 0 &&
  typeof attempt.review.overallComments === 'string' &&
  attempt.review.overallComments.trim().length > 0;

    if (hasReview ) {
      return res.status(200).json({ success: true, message: 'Review already exists', attempts: [attempt] });
    }
    const mcqFeedback = await reviewMCQ(attempt);
    const codingFeedback = await reviewCoding(attempt);
    const overallComments = await generateOverallSuggestion(attempt, mcqFeedback, codingFeedback);

    attempt.review = {
      mcqComments: mcqFeedback,
      codingFeedback,
      overallComments,
    };
    await attempt.save();
    res.json({ success: true, attempts: [attempt] });
  } catch (err) {
    next(err);
  }
};
export const LeaveQuiz=async (req,res,next)=>{
  res.clearCookie('quizToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.clearCookie('quizId', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ success: true });
};
export const GetQuiz = async (req, res, next) => {
  try {
    const quiz=req.quiz;
    res.status(200).json({ success: true, quiz:quiz });
  } catch (err) {
    next(err);
  }
};

export const GetTemplate = async (req, res, next) => {
  try {
    const { language, version } = req.body;
    const quiz = req.quiz;

    if (!language || !version) {
      throw createError(400, `Language and version are required`)
      //return res.status(400).json({ success: false, message: 'Language and version are required' });
    }

    // Check if template already exists
    const existingTemplate = quiz.codeTemplates.find(
      (t) => t.language === language && t.version === version
    );

    if (existingTemplate) {
      return res.status(200).json({ success: true, template: existingTemplate.template });
    }

    // If no coding question or empty, cannot generate
    if (!quiz.coding || quiz.coding.length === 0) {
      throw createError(400, `No coding question available to generate template`)
      //return res.status(400).json({ success: false, message: 'No coding question available to generate template' });
    }

    const codingQuestion = quiz.coding[0];
    const {
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      sampleInput,
      sampleOutput
    } = codingQuestion;

    // Generate new template
    const template = await generateCodeTemplate(
      {
        title,
        description,
        inputFormat,
        outputFormat,
        constraints,
        sampleInput,
        sampleOutput
      },
      language,
      version
    );
    await Quiz.findByIdAndUpdate(
      quiz._id,
      {
        $push: {
          codeTemplates: {
            language,
            version,
            template,
          },
        },
      },
      { new: true }
    );

    await quiz.save(); // persist to DB

    res.status(200).json({
      success: true,
      template
    });

  } catch (err) {
    console.error("Template generation error:", err);
    next(err);
  }
};


