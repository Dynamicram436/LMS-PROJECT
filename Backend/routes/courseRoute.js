import express from 'express';
import { verifyToken } from '../middleware/auth.js'; // Importing verifyToken from middleware
import { createCourse, getCourses, getCourseById, selectCourse } from '../controllers/courseController.js';

const router = express.Router();

// Public reads
router.get('/', getCourses);
router.get('/:courseId', getCourseById);

// Record course selection (no auth to keep UX simple)
router.post('/select', selectCourse);

// Protected create (admin only)
router.post('/', verifyToken, async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      error: 'Unauthorized',
      message: 'Only admins can create courses'
    });
  }
  next();
}, createCourse);

export default router;
