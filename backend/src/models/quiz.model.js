import mongoose from 'mongoose';

const mcqSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
});

const codingSchema = new mongoose.Schema({
  title: String,
  description: String,
  inputFormat: String,
  outputFormat: String,
  constraints: String,
  sampleInput: String,
  sampleOutput: String,
  testCases: [{
    input: String,
    output: String,
  }],
});

const quizSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  topic: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  numQuestions: Number,
  type: { type: String, enum: ['text', 'pdf'] },
  mcqs: [mcqSchema],
  coding: [codingSchema],
  subject:{type:String, default:''},
  language:{type:String, default:''},
  image: {type:String,default:''},
  duration: { type: Number, default: 10 },
  codingLanguages:[{
    language: String,
    version: String,
    aliases: [String],
  }],
  codeTemplates: [
  {
    language: String,
    version: String,
    template: String
  }
],
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model('Quiz', quizSchema);
