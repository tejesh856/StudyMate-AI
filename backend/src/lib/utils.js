import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { generateCourseSubChapter } from "../langchain/learn/generateCourseSubChapter.js";
dotenv.config({ path: `${process.cwd()}/.env` });

export const generateAuthToken = (userId, res) => {
  const payload = { userId };
  const secret = process.env.AUTH_SECRET;
  const expiresIn = "7d";

  // Generate the token
  const token = jwt.sign(payload, secret, { expiresIn });

  const isProduction = process.env.NODE_ENV === "production";


  // Send the token as a response (optional: store it in a cookie)
  res.cookie("authToken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "strict",
    secure: isProduction,
  });

  return token;
};
export const generateQuizToken = (quiz, res) => {
  console.log("Generating quiz token for quiz:", quiz._id);
  const payload = { quizId: quiz._id };
  const secret = process.env.QUIZ_SECRET;
  const expiresIn = "10m";

  // Generate the token
  const token = jwt.sign(payload, secret, { expiresIn });
  const isProduction = process.env.NODE_ENV === "production";
  // Send the token as a response (optional: store it in a cookie)
  res.cookie("quizToken", token, {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "strict",
    secure: isProduction,
  });
  res.cookie("quizId", String(quiz._id), {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "strict",
    secure: isProduction,
  });

  return token;
};
export function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}
export const isJsonEqual = (a, b) => {
    try {
      const parsedA = JSON.parse(a);
      const parsedB = JSON.parse(b);
      return JSON.stringify(parsedA) === JSON.stringify(parsedB);
    } catch {
      return a.trim() === b.trim();
    }
  };
const batch = (arr, size) =>
  arr.reduce((acc, _, i) => (i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc), []);

export const enrichChapters = async (chapters, difficulty, subject, domain) => {
  const enrichedChapters = [];

  for (const chapter of chapters) {
    const subBatches = batch(chapter.subChapters, 5); // batch 5 at a time
    const enrichedSubChapters = [];

    for (const subBatch of subBatches) {
      const batchResult = await generateCourseSubChapter({
        subChapters: subBatch,
        difficulty,
        subject,
        domain,
      });

      for (let i = 0; i < subBatch.length; i++) {
        enrichedSubChapters.push({
          ...subBatch[i],
          studyMaterial: batchResult[i],
        });
      }
    }

    enrichedChapters.push({
      title: chapter.title,
      description: chapter.description,
      includeVideo: chapter.includeVideo,
      subChapters: enrichedSubChapters,
    });
  }

  return enrichedChapters;
};


export const calculateLearningStreak = (activityDates) => {
  const dateSet = new Set(
    activityDates.map(date => dayjs(date).startOf('day').format('YYYY-MM-DD'))
  );

  let streak = 0;
  let currentDate = dayjs();

  while (dateSet.has(currentDate.format('YYYY-MM-DD'))) {
    streak += 1;
    currentDate = currentDate.subtract(1, 'day');
  }

  return streak;
};

export const formatMMSS = (seconds) => {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
};