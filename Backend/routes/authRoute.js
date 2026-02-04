import express from 'express';
import { loginUser } from '../controllers/authControllers.js';
import { teacherLogin } from '../controllers/teacherAuthController.js';

const router = express.Router();

// Existing user login route
router.post('/login', loginUser);

// New teacher login route
router.post('/teacher-login', teacherLogin);

export default router;