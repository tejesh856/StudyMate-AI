import mongoose from 'mongoose';

const QuizConversationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    input: {
      topic: String,
      difficulty: String,
      numQuestions: Number,
    },
    output: {
      mcqs: Array,
      coding: Array,
    },
    isCoding: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model('QuizConversation', QuizConversationSchema);
