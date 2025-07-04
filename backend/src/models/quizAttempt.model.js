// models/quizAttempt.model.js
import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mcqAnswers: { type: Object },
  codeAnswers: { type: Object },
  mcqscore: Number,
  codingscore: Number,
  totalscore: Number,
  currentIndex: { type: Number, default: 0 },
  review: {
  mcqComments: { type: Object },
  codingFeedback: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      correct: Boolean,
      feedback: String,
    },
  ],
  overallComments: String,
},

  submittedAt: Date,
  startTime: Date, // ✅ Add this field
});


export default mongoose.model('QuizAttempt', quizAttemptSchema);
