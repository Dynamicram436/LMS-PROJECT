import express from "express";
import { saveExamResult, getExamResults, getExamQuestions, createExamQuestions, seedExamQuestions, updateVideoProgress, getExamHistory, getCourseStructure } from "../controllers/examController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create exam questions (admin only - can be made public if needed)
router.post("/questions", createExamQuestions);

// Seed exam questions (for initial setup)
router.post("/seed", seedExamQuestions);

// Get exam questions (public endpoint, no auth required)
router.get("/questions", getExamQuestions);
router.get("/questions/:courseId", getExamQuestions);

// Get course structure for dropdowns
router.get("/structure", getCourseStructure);

// Get filtered questions
router.get("/questions/filter", getExamQuestions);

// Save exam results (auth removed temporarily since login doesn't generate tokens)
router.post("/results", saveExamResult);

// Get user's exam results (optional auth - works without token for now)
router.get("/results/:userId", getExamResults);

// Update video progress
router.post("/video-progress", updateVideoProgress);

// Get exam history for a specific course
router.get("/history/:courseId", getExamHistory);

export default router;
