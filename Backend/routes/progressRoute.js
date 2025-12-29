import express from 'express';
import { verifyToken } from './authRoute.js'; // Assuming you have authentication middleware
import {
  updateVideoProgress,
  checkExamEligibility,
  submitExam,
  getCourseProgress
} from '../controllers/progressController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Update video progress
router.post('/progress/video', updateVideoProgress);

// Check exam eligibility
router.get('/courses/:courseId/check-eligibility', checkExamEligibility);

// Submit exam
router.post('/courses/:courseId/exam', submitExam);

// Get course progress
router.get('/courses/:courseId/progress', getCourseProgress);

export default router;
