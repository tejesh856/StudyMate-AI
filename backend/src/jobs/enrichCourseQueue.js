// jobs/enrichCourseQueue.js
import { Queue } from 'bullmq';
import { client } from '../lib/redisClient.js';

export const enrichCourseQueue = new Queue('enrichCourse', {
  connection: client,
});
