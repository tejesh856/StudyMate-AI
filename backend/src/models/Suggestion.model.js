// 📁 models/suggestion.model.js
import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  suggestions: [
    {
      type: { type: String, enum: ["reviewQuiz", "attemptQuiz", "newCourse"], required: true },
      text: { type: String, required: true },
      link: { type: String, required: true },
      highlightText: { type: String, required: true },
      topic: String,
      description: String,
      difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
      },
      numofchapters: Number,
      includeVideo: Boolean,
    },
  ],
  stats: {
    totalQuizzesTaken: Number,
    coursesCompleted: Number,
    learningStreak: Number,
    aiSuggestionCount: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Suggestion", suggestionSchema);
