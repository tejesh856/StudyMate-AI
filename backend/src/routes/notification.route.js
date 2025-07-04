import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getNotifications, markReadNotification } from '../controller/notifications.controller.js';
const router = express.Router();

router.get('/',protectRoute,getNotifications)
router.patch('/:id/read',protectRoute,markReadNotification);
export default router;