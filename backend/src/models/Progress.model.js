import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedSubChapters: [{ type: String }], // Store subChapter._id as string
}, { timestamps: true });

export default mongoose.model('Progress', ProgressSchema);
