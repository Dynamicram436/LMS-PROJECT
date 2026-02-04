import express from 'express';
import { uploadMaterial, getTeacherUploads, getAllUploads, deleteUpload } from '../controllers/teacherController.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// Teacher upload route
router.post('/upload', protect, teacherOnly, uploadMaterial);

// Get teacher's uploads
router.get('/uploads', protect, teacherOnly, getTeacherUploads);

// Get all uploads (for admin purposes)
router.get('/all-uploads', protect, teacherOnly, getAllUploads);

// Delete upload
router.delete('/upload/:id', protect, teacherOnly, deleteUpload);

export default router;