import User from "../models/userSchema.js";
import ExamQuestion from "../models/examQuestionSchema.js";
import ExamAttempt from "../models/examAttemptSchema.js";
import ExamAttemptDatabase from "../models/examAttemptDatabaseSchema.js";
import  seedQuestions  from "../seedExamQuestions.js";
import asyncHandler from "express-async-handler";

export const saveExamResult = asyncHandler(async (req, res) => {
    const { userId, courseId, score, totalQuestions, answers, attemptId } =
      req.body;

    // console.log(`[SaveExamResult] Received request for userId: ${userId}, courseId: ${courseId}`);
    // console.log(`[SaveExamResult] Answers received: ${answers ? answers.length : 0} answers`);
    if (answers && answers.length > 0) {
      console.log(`[SaveExamResult] First answer:`, JSON.stringify(answers[0], null, 2));
    }

    // Find the user by userid field (not MongoDB _id)
    const user = await User.findOne({ userid: userId });
    if (!user) {
      console.error(`[SaveExamResult] User not found: ${userId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate required fields
    if (!courseId || score === undefined || !totalQuestions) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: courseId, score, and totalQuestions are required",
      });
    }

    // Find or create course progress
    let courseProgress = user.courseProgress.find((progress) => {
      const progressCourseId = progress.courseId?.toString
        ? progress.courseId.toString()
        : String(progress.courseId);
      return progressCourseId === String(courseId);
    });

    if (!courseProgress) {
      courseProgress = {
        courseId: courseId,
        videos: [],
        exam: {
          score: 0,
          passed: false,
          attempts: 0,
          answers: [],
        },
        examAttempts: [],
        completionPercentage: 0,
      };
      user.courseProgress.push(courseProgress);
      courseProgress = user.courseProgress[user.courseProgress.length - 1];
    }

    const percentageScore = Math.round((score / totalQuestions) * 100);
    const passed = percentageScore >= 70;
    const attemptNumber = (courseProgress.exam?.attempts || 0) + 1;
    const finalAttemptId = attemptId || `${userId}_${courseId}_${Date.now()}`;

    // Create separate ExamAttempt document
    const examAttempt = new ExamAttempt({
      userId: userId,
      courseId: courseId,
      attemptId: finalAttemptId,
      attemptNumber: attemptNumber,
      score: percentageScore,
      totalQuestions: totalQuestions,
      correctAnswers: score,
      passed: passed,
      answers: answers || [],
      attemptDate: new Date(),
    });

    await examAttempt.save();

    // Update user's course progress (keep existing structure for compatibility)
    courseProgress.examAttempts = courseProgress.examAttempts || [];
    courseProgress.examAttempts.push({
      examAttemptId: finalAttemptId,
      score: percentageScore,
      passed,
      attemptNumber,
      attemptDate: new Date(),
      answers: answers || [],
    });

    courseProgress.exam = {
      score: percentageScore,
      passed,
      attempts: attemptNumber,
      lastAttempt: new Date(),
      answers: answers || [],
    };

    const videoCompletion =
      courseProgress.videos.length > 0
        ? (courseProgress.videos.filter((v) => v.isCompleted).length /
            courseProgress.videos.length) *
          50
        : 0;
    const examCompletion = passed ? 50 : 0;
    courseProgress.completionPercentage = Math.min(
      100,
      videoCompletion + examCompletion
    );

    await user.save();
    console.log(`[SaveExamResult] Successfully saved exam result for ${userId}`);

    res.status(200).json({
      success: true,
      data: {
        score: percentageScore,
        passed,
        totalQuestions,
        correctAnswers: score,
        completionPercentage: courseProgress.completionPercentage,
        attemptId: finalAttemptId,
      },
    });
});

// Get all exam attempts for a user from the ExamAttempt collection
export const getAllExamAttempts = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { courseId } = req.query;

    let query = { userId: userId };
    if (courseId) {
      query.courseId = courseId;
    }

    const examAttempts = await ExamAttempt.find(query)
      .sort({ attemptDate: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: examAttempts,
    });
});

export const getExamResults = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Find user by userid field
    const user = await User.findOne({ userid: userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Filter courses that have at least one attempt recorded in courseProgress
    const attemptedCourses = user.courseProgress.filter(
      (progress) =>
        progress.exam?.attempts > 0 ||
        (progress.examAttempts && progress.examAttempts.length > 0)
    );

    const examResults = await Promise.all(
      attemptedCourses.map(async (progress) => {
        const courseId = progress.courseId?.toString
          ? progress.courseId.toString()
          : String(progress.courseId);

        // console.log(`[getExamResults] Fetching attempts for userId: ${userId}, courseId: ${courseId}`);

        // Fetch full attempt details from ExamAttempt collection
        let detailedAttempts = await ExamAttempt.find({
          userId: userId,
          courseId: courseId,
        })
          .sort({ attemptNumber: 1 })
          .lean();
        
        // console.log(`[getExamResults] Found ${detailedAttempts.length} detailed attempts for courseId: ${courseId}`);
        if (detailedAttempts.length > 0) {
          // console.log(`[getExamResults] First attempt answers count: ${detailedAttempts[0].answers?.length || 0}`);
        } else {
          // Fallback: If no records in ExamAttempt collection, use embedded courseProgress.examAttempts
          // console.log(`[getExamResults] No ExamAttempt records found, using fallback from courseProgress`);
          if (progress.examAttempts && progress.examAttempts.length > 0) {
            detailedAttempts = progress.examAttempts.map((attempt, index) => ({
              ...attempt,
              userId: userId,
              courseId: courseId,
              // Use attemptId if not present
              attemptId: attempt.examAttemptId || `${userId}_${courseId}_${index}`,
            }));
            // console.log(`[getExamResults] Using ${detailedAttempts.length} attempts from courseProgress`);
          }
        }

        // Map attempts to the format expected by the frontend
        const enrichedExamAttempts = detailedAttempts.map((attempt) => ({
          ...attempt,
          // Ensure attemptDate is a Date object for the frontend
          attemptDate: attempt.attemptDate || attempt.createdAt,
          // The answers are already in the ExamAttempt document
          answers: (attempt.answers || []).map((answer) => ({
            ...answer,
            // Ensure fallback values if for some reason question text is missing
            question: answer.question || `Question ${answer.questionIndex + 1}`,
            options: answer.options || [],
          })),
        }));

        // Get the latest attempt to represent the overall course result
        const latestAttempt =
          enrichedExamAttempts.length > 0
            ? enrichedExamAttempts[enrichedExamAttempts.length - 1]
            : null;

        return {
          courseId: courseId,
          courseName: progress.courseName || courseId, // Fallback to courseId if name missing
          score: latestAttempt
            ? latestAttempt.score
            : progress.exam?.score || 0,
          passed: latestAttempt
            ? latestAttempt.passed
            : progress.exam?.passed || false,
          attempts: enrichedExamAttempts.length,
          lastAttempt: latestAttempt
            ? latestAttempt.attemptDate
            : progress.exam?.lastAttempt,
          completionPercentage: progress.completionPercentage,
          // Use answers from the latest attempt or the enriched ones
          answers: latestAttempt ? latestAttempt.answers : [],
          examAttempts: enrichedExamAttempts,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: examResults,
    });
});

// Create exam questions for a category/course/video
export const createExamQuestions = async (req, res) => {
  try {
    const { category, course, video, questions } = req.body;

    // Validate required fields
    if (
      !category ||
      !course ||
      !video ||
      !questions ||
      !Array.isArray(questions)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "category, course, video, and questions array are required",
      });
    }

    // Validate category
    const validCategories = [
      "English",
      "Telugu",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Studies",
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `category must be one of: ${validCategories.join(", ")}`,
      });
    }

    // Validate questions structure
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (
        !q.qType ||
        !q.qId ||
        !q.qDesc ||
        !Array.isArray(q.choices) ||
        q.choices.length < 2 ||
        !q.correctAns
      ) {
        return res.status(400).json({
          success: false,
          message: `Question ${
            i + 1
          } is invalid. Each question must have: qType (string), qId (string), qDesc (string), choices (array of at least 2 strings), and correctAns (string)`,
        });
      }
    }

    // Check if exam questions already exist for this category, course, and video
    const existingExam = await ExamQuestion.findOne({
      category: category,
      course: course,
      video: video,
    });

    if (existingExam) {
      // Update existing exam questions
      existingExam.questions = questions;
      await existingExam.save();

      return res.status(200).json({
        success: true,
        message: "Exam questions updated successfully",
        data: existingExam,
      });
    }

    // Create new exam questions
    const examData = await ExamQuestion.create({
      category: category,
      course: course,
      video: video,
      questions: questions,
    });

    res.status(201).json({
      success: true,
      message: "Exam questions created successfully",
      data: examData,
    });
  } catch (error) {
    console.error("Error creating exam questions:", error);

    // Handle duplicate key error (from unique index)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Exam questions already exist for this chapterId and category combination",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Create a new exam attempt database
export const createExamAttemptDatabase = async (req, res) => {
  try {
    const { userId, courseId, chapterId, category, chapterName } = req.body;

    // Validate required fields
    if (!userId || !courseId || !chapterId || !category || !chapterName) {
      return res.status(400).json({
        success: false,
        message:
          "userId, courseId, chapterId, category, and chapterName are required",
      });
    }

    // Validate chapterId is a number
    const chapterIdNum = parseInt(chapterId);
    if (isNaN(chapterIdNum)) {
      return res.status(400).json({
        success: false,
        message: "chapterId must be a valid number",
      });
    }

    // Get the original questions from the main database
    const originalExamData = await ExamQuestion.findOne({
      chapterId: chapterIdNum,
      category: category,
    });

    if (
      !originalExamData ||
      !originalExamData.questions ||
      originalExamData.questions.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this chapter in the main database",
      });
    }

    // Generate unique attempt ID
    const attemptId = `${userId}_${courseId}_${Date.now()}`;

    // Create new attempt-specific database with the same questions
    const examAttemptDatabase = new ExamAttemptDatabase({
      attemptId: attemptId,
      userId: userId,
      courseId: courseId,
      chapterId: chapterIdNum,
      category: category,
      chapterName: chapterName,
      questions: originalExamData.questions,
      isActive: true,
    });

    await examAttemptDatabase.save();

    res.status(201).json({
      success: true,
      message: "Exam attempt database created successfully",
      data: {
        attemptId: attemptId,
        chapterId: chapterIdNum,
        category: category,
        chapterName: chapterName,
        questions: originalExamData.questions,
      },
    });
  } catch (error) {
    console.error("Error creating exam attempt database:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get exam questions by category, course, and video
export const getExamQuestions = async (req, res) => {
  try {
    const { category, course, video, chapterId, numQuestions, attemptId } = req.query;

    // Support both old format (category, course, video) and new format (chapterId, category)
    let queryCategory = category;
    let queryChapterId = chapterId ? parseInt(chapterId) : null;

    // Validate required parameters
    if (!queryCategory) {
      return res.status(400).json({
        success: false,
        message: "category is required",
      });
    }

    // If chapterId is provided, use it; otherwise require course and video
    if (!queryChapterId && (!course || !video)) {
      return res.status(400).json({
        success: false,
        message: "Either chapterId or (course and video) are required",
      });
    }

    let examData;

    // If attemptId is provided, try to get questions from attempt-specific database
    if (attemptId) {
      examData = await ExamAttemptDatabase.findOne({
        attemptId: attemptId,
        isActive: true,
      });
    }

    // If no attempt-specific data found, fall back to main database
    if (!examData) {
      if (queryChapterId) {
        // Search by chapterId and category
        examData = await ExamQuestion.findOne({
          chapterId: queryChapterId,
          category: queryCategory,
        });
      } else {
        // Search by category, course, and video
        examData = await ExamQuestion.findOne({
          category: queryCategory,
          course: course,
          video: video,
        });
      }
    }

    // If no questions found, try to seed the database
    if (!examData || !examData.questions || examData.questions.length === 0) {
      console.log("No questions found, attempting to seed database...");
      const seedResult = await seedQuestions();
      
      if (seedResult.success) {
        console.log("Database seeded successfully, trying to fetch questions again...");
        if (queryChapterId) {
          examData = await ExamQuestion.findOne({
            chapterId: queryChapterId,
            category: queryCategory,
          });
        } else {
          examData = await ExamQuestion.findOne({
            category: queryCategory,
            course: course,
            video: video,
          });
        }
      }
    }

    if (!examData || !examData.questions || examData.questions.length === 0) {
      return res.status(200).json({
        success: false,
        message:
          "No questions found for this course/video. Please seed the database with exam questions.",
        data: {
          category: category,
          course: course,
          video: video,
          questions: [],
        },
      });
    }

    // Normalize questions to handle both old and new schema formats
    const normalizedQuestions = examData.questions.map((q, index) => {
      // If question is in the old format (question, options, correctAnswer)
      if (q.question && Array.isArray(q.options) && q.correctAnswer !== undefined) {
        return {
          qType: "MCQ",
          qId: `Q${index + 1}`,
          qDesc: q.question,
          choices: q.options,
          correctAns: q.options[q.correctAnswer],
          // Also preserve the original fields for compatibility
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        };
      }
      // If question is in the new format (qType, qId, qDesc, choices, correctAns)
      else if (q.qType && q.qId && q.qDesc && Array.isArray(q.choices) && q.correctAns) {
        return q;
      }
      // Fallback
      else {
        return {
          qType: "MCQ",
          qId: `Q${index + 1}`,
          qDesc: q.question || `Question ${index + 1}`,
          choices: q.options || [],
          correctAns: q.options ? q.options[q.correctAnswer] : "",
        };
      }
    });

    // Randomize questions order for each exam attempt
    const shuffledQuestions = [...normalizedQuestions].sort(
      () => Math.random() - 0.5
    );

    // If numQuestions is specified and valid, return only that many questions
    let finalQuestions = shuffledQuestions;
    if (numQuestions && !isNaN(parseInt(numQuestions))) {
      const requestedCount = parseInt(numQuestions);
      if (requestedCount > 0 && requestedCount < shuffledQuestions.length) {
        finalQuestions = shuffledQuestions.slice(0, requestedCount);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        category: examData.category,
        course: examData.course,
        video: examData.video,
        questions: finalQuestions,
        attemptId: examData.attemptId || null,
      },
    });
  } catch (error) {
    console.error("Error fetching exam questions:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Seed exam questions endpoint
export const seedExamQuestions = async (req, res) => {
  try {
    const result = await seedQuestions();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error("Error seeding exam questions:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
