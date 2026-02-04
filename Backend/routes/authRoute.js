import express from 'express';
import { loginUser, teacherLogin } from '../controllers/authControllers.js';

const router = express.Router();

// Existing user login route
router.post('/login', loginUser);

// New teacher login route
router.post('/teacher-login', teacherLogin);

export default router;
