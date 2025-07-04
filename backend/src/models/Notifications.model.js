// models/Notification.model.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['course_ready', 'quiz_result', 'general'],
    default: 'general',
  },
  title: String,
  message: String,
  metadata: Object, // optional: e.g., { courseId, quizId }
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Notification', notificationSchema);
