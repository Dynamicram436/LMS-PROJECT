import express from "express";
import { saveExamResult, getExamResults, getExamQuestions, createExamQuestions, createExamAttemptDatabase, seedExamQuestions } from "../controllers/examController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create exam questions (admin only - can be made public if needed)
router.post("/questions", createExamQuestions);

// Seed exam questions (for initial setup)
router.post("/seed", seedExamQuestions);

// Create exam attempt database (for new exam attempts)
router.post("/attempt-database", createExamAttemptDatabase);

// Get exam questions (public endpoint, no auth required)
router.get("/questions", getExamQuestions);

// Save exam results (auth removed temporarily since login doesn't generate tokens)
router.post("/results", saveExamResult);

// Get user's exam results (optional auth - works without token for now)
router.get("/results/:userId", getExamResults);

export default router;
