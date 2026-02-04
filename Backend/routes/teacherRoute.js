import express from 'express';
import teacherController from '../controllers/teacherController.js';

const router = express.Router();

// Teacher upload route
router.post('/teachers/upload', teacherController);

export default router;
