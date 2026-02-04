import express from 'express';
import { teacherLogin, registerTeacher, getTeacherProfile, updateTeacherProfile } from '../controllers/teacherAuthController.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// Teacher login
router.post('/login', teacherLogin);

// Teacher registration (requires admin or specific permissions)
router.post('/register', registerTeacher);

// Get teacher profile
router.get('/profile', protect, teacherOnly, getTeacherProfile);

// Update teacher profile
router.put('/profile', protect, teacherOnly, updateTeacherProfile);

export default router;