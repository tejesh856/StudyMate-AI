import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { CourseFlowGenerate, generateCourseMaterial, getCourse, getCourses, markSubChapterComplete, updateCourse } from '../controller/learn.controller.js';
const router = express.Router();

router.post('/generate-course-flow', protectRoute, CourseFlowGenerate);
router.get('/courses', protectRoute, getCourses);
router.post('/generate-course', protectRoute, generateCourseMaterial);
router.get('/course/:id',protectRoute,getCourse)
router.patch('/course/:id',protectRoute,updateCourse);
router.post('/complete', protectRoute, markSubChapterComplete);
export default router;