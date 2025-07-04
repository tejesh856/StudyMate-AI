import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { GetPastQuizzes, GetQuiz, GetTemplate, LeaveQuiz, QuizGenerate, ReviewQuizAttempt } from '../controller/quiz.controller.js';
import { protectQuizRoute } from '../middleware/quiz.middleware.js';

const router = express.Router();

router.post('/generate', protectRoute, QuizGenerate);
router.get('/past', protectRoute, GetPastQuizzes);
router.get('/review/:quizId', protectRoute, ReviewQuizAttempt);
router.post('/leave',protectRoute,LeaveQuiz);
router.get('/',protectRoute,protectQuizRoute, GetQuiz);
router.post('/template',protectRoute,protectQuizRoute, GetTemplate);


export default router;
