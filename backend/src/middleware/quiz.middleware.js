import jwt from "jsonwebtoken";
import createError from "http-errors";
import Quiz from "../models/quiz.model.js";
export const protectQuizRoute = async (req, res, next) => {
  try {
    const token = req.cookies.quizToken;

    // Check if token exists
    if (!token) {
      throw createError.Unauthorized("Unauthorized - Token not provided");
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.QUIZ_SECRET);
    if (!decoded || !decoded.quizId) {
      throw createError.Unauthorized("Unauthorized - Invalid Token");
    }

    // Find the user in the database
    const quiz = await Quiz.findById(decoded.quizId);
    if (!quiz) {
      throw createError.NotFound("quiz not found");
    }

    // Attach the user object to the request
    req.quiz = quiz;
    next();
  } catch (err) {
    // Handle JWT verification errors
    const message =
      err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"
        ? "Unauthorized - Invalid or Expired Token"
        : err.message;

    next(createError(401, message));
  }
};