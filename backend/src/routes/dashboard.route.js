import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getResumeProgress, getStats } from '../controller/dashboard.controller.js';
const router = express.Router();


router.get('/stats', protectRoute, getStats);
router.get('/progress/resume', protectRoute, getResumeProgress);
export default router;