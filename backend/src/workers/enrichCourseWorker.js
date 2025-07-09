// workers/enrichCourseWorker.js
import { Worker } from 'bullmq';
import Course from '../models/Course.model.js';
import { client } from '../lib/redisClient.js';
import { io } from '../socket/globalsocket.js';
import Notifications from '../models/Notifications.model.js';
import { enrichChapters } from '../lib/utils.js';

let enrichCourseWorker = null;

const startEnrichCourseWorker = () => {
  if (enrichCourseWorker) return; // ⛔ Don't start again


  enrichCourseWorker = new Worker(
    'enrichCourse',
    async (job) => {
      const { courseId, chapters, difficulty, subject, domain, includeVideo } = job.data;

      try {
        console.log('job started');
        console.log('🧪 Received job:', job.data);
        const enrichedChapters = await enrichChapters(chapters, difficulty, subject, domain, includeVideo);

        await Course.findByIdAndUpdate(courseId, {
          chapters: enrichedChapters,
          status: 'ready',
          createdAt: new Date(),
        });

        const updatedCourse = await Course.findById(courseId);

        const notification=await Notifications.create({
          userId: updatedCourse.studentId,
          type: 'course_ready',
          title: 'Course Ready',
          message: `Your course "${updatedCourse.topicTitle}" is now available!`,
          metadata: { courseId },
        });

        io.to(updatedCourse.studentId.toString()).emit('course:ready', {
          course:updatedCourse,
          notification,
          message: `Your course "${updatedCourse.topicTitle}" is ready!`,
        });

        console.log(`✅ Course ${courseId} enriched successfully.`);
      } catch (err) {
        console.error(`❌ Failed to enrich course ${courseId}:`, err);
        throw err;
      }
    },
    { connection: client }
  );
  enrichCourseWorker.on('completed', (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

enrichCourseWorker.on('failed', (job, err) => {
  console.error(`💥 Job ${job.id} failed:`, err);
});


  console.log('✅ enrichCourseWorker started.');
};
export const init = async () => {
  startEnrichCourseWorker();
};