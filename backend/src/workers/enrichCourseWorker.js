// workers/enrichCourseWorker.js
import { Worker } from 'bullmq';
import { enrichChapters } from '../utils/enrichChapters.js';
import Course from '../models/Course.model.js';
import { client } from '../lib/redisClient.js';
import { io } from '../socket/globalsocket.js';
import Notifications from '../models/Notifications.model.js';

const enrichCourseWorker = new Worker(
  'enrichCourse',
  async (job) => {
    const { courseId, chapters, difficulty, subject, domain, includeVideo } = job.data;

    try {
      const enrichedChapters = await enrichChapters(chapters, difficulty, subject, domain, includeVideo);

      await Course.findByIdAndUpdate(courseId, {
        chapters: enrichedChapters,
        status: 'ready',
        createdAt: new Date(),
      });
      const updatedCourse = await Course.findById(courseId).select('studentId topicTitle');
      await Notifications.create({
  userId: updatedCourse.studentId,
  type: 'course_ready',
  title: 'Course Ready',
  message: `Your course "${updatedCourse.topicTitle}" is now available!`,
  metadata: {
    courseId,
  },
});
      io.to(updatedCourse.studentId).emit('course:ready', {
        courseId,
        message: `Your course "${updatedCourse.topicTitle}" is ready!`,
      });

      console.log(`✅ Course ${courseId} enriched successfully.`);
    } catch (err) {
      console.error(`❌ Failed to enrich course ${courseId}:`, err);
      throw err;
    }
  },
  {
    connection: client,
  }
);
