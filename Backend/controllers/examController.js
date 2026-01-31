import ExamAttempt from "../models/examAttemptSchema.js";
import User from "../models/userSchema.js";
import ExamQuestion from "../models/examQuestionSchema.js";
import seedQuestions from "../seedExamQuestions.js";
import asyncHandler from "express-async-handler";

export const updateVideoProgress = asyncHandler(async (req, res) => {
  const { userId, courseId, videoId, isCompleted, progressPercentage, totalVideos } = req.body;

  console.log('[updateVideoProgress] Received request:', { userId, courseId, videoId, isCompleted, progressPercentage, totalVideos });

  if (!userId || !courseId || !videoId) {
    console.log('[updateVideoProgress] Missing required fields');
    return res.status(400).json({
      success: false,
      message: "userId, courseId, and videoId are required",
    });
  }

  try {
    // Find the user
    const user = await User.findOne({ userid: userId });
    console.log('[updateVideoProgress] User lookup result:', user ? 'Found user' : 'User not found');

    if (!user) {
      // Log all existing users for debugging
      const allUsers = await User.find({}, 'userid email');
      console.log('[updateVideoProgress] All users in database:', allUsers);

      return res.status(404).json({
        success: false,
        message: `User with ID '${userId}' not found. Available users: ${allUsers.map(u => u.userid).join(', ') || 'None'}`,
      });
    }

    // Extract base course ID if it follows the pattern "course-chapter-id"
    const getBaseCourseId = (fullCourseId) => {
      const strId = String(fullCourseId);
      // If it follows pattern like "CSE-chapter-101", extract "CSE"
      const match = strId.match(/^([A-Za-z]+)(?:-chapter-\d+)?/);
      return match ? match[1] : strId;
    };

    // Find or create course progress - ensure consistent string comparison
    let courseProgress = user.courseProgress.find((p) => {
      const progressCourseId = String(p.courseId);
      const requestCourseId = String(courseId);

      // Try exact match first
      if (progressCourseId.toLowerCase().trim() === requestCourseId.toLowerCase().trim()) {
        return true;
      }

      // If exact match fails, try base course ID match (for cases like "CSE" vs "CSE-chapter-101")
      const baseProgressCourseId = getBaseCourseId(progressCourseId);
      const baseRequestCourseId = getBaseCourseId(requestCourseId);

      return baseProgressCourseId.toLowerCase().trim() === baseRequestCourseId.toLowerCase().trim();
    });

    if (!courseProgress) {
      courseProgress = {
        courseId: courseId,
        videos: [],
        exam: { attempts: 0, passed: false, score: 0 },
        completionPercentage: 0,
      };
      user.courseProgress.push(courseProgress);
      courseProgress = user.courseProgress[user.courseProgress.length - 1];
    }

    // Check if this is for an exam (videoId starts with 'exam_')
    if (videoId.startsWith('exam_')) {
      // For exam progress, we set the completion to 100% when marking as complete
      if (progressPercentage !== undefined && progressPercentage === 100) {
        courseProgress.completionPercentage = 100;
      } else if (isCompleted) {
        // If just marking as completed without specific percentage, set to 100%
        courseProgress.completionPercentage = 100;
      }
    } else {
      // Original video progress handling
      // Find or create video progress
      let videoProgress = courseProgress.videos.find((v) => v.videoId === videoId);

      if (!videoProgress) {
        videoProgress = {
          videoId: videoId,
          isCompleted: isCompleted || false,
          lastWatched: new Date(),
        };
        courseProgress.videos.push(videoProgress);
      } else {
        videoProgress.isCompleted = isCompleted !== undefined ? isCompleted : videoProgress.isCompleted;
        videoProgress.lastWatched = new Date();
      }

      // Recalculate completion percentage
      // Count completed videos vs total in the progression
      // Exclude exam videos from the video completion calculation
      const nonExamVideos = courseProgress.videos.filter(v => !v.videoId.startsWith('exam_'));
      const completedNonExamVideos = nonExamVideos.filter(v => v.isCompleted).length;

      // Map of total topics per course category from courseCatalog.js
      const topicCounts = {
        "CSE": 7,
        "ECE": 4,
        "Mechanical": 4,
        "Civil": 4,
        "EEE": 4,
        "Diploma": 2
      };

      // Convert courseId to string and extract base course ID to ensure proper lookup
      const courseIdStr = String(courseId);
      const baseCourseId = getBaseCourseId(courseIdStr);  // Use the function defined above
      
      // Use totalVideos from frontend if available, otherwise fallback
      const totalExpectedVideos = totalVideos || topicCounts[baseCourseId] || Math.max(nonExamVideos.length, 4);

      // Calculate progress treating videos and exam as items
      // This fixes the issue where progress was capped at 50% if exam wasn't passed
      
      const examPassed = courseProgress.exam?.passed || false;
      const totalItems = totalExpectedVideos + 1; // Videos + 1 Exam
      const completedItems = completedNonExamVideos + (examPassed ? 1 : 0);
      
      // Calculate percentage based on items completed
      courseProgress.completionPercentage = Math.min(100, Math.round((completedItems / totalItems) * 100));
    }

    if (courseProgress.completionPercentage >= 100) {
      courseProgress.isCourseCompleted = true;
    }

    // Mark the field as modified to ensure Mongoose saves it
    user.markModified('courseProgress');
    await user.save();

    console.log('[updateVideoProgress] Successfully updated progress:', {
      userId,
      courseId,
      videoId,
      completionPercentage: courseProgress.completionPercentage
    });

    res.status(200).json({
      success: true,
      data: {
        completionPercentage: courseProgress.completionPercentage,
        isCompleted: videoId.startsWith('exam_') ? (progressPercentage === 100) : courseProgress.videos.some(v => v.videoId === videoId && v.isCompleted),
      },
    });
  } catch (error) {
    console.error('[updateVideoProgress] Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while updating video progress',
      error: error.message
    });
  }
});

export const saveExamResult = asyncHandler(async (req, res) => {
  const { userId, score, totalQuestions, answers, attemptId } =
    req.body;

  // Ensure courseId is a string
  const courseId = String(req.body.courseId);

  console.log(`[SaveExamResult] Received request for userId: ${userId}, courseId: "${courseId}" (type: ${typeof courseId})`);
  console.log(`[SaveExamResult] Answers received: ${answers ? answers.length : 0} answers`);
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

  // Extract base course ID if it follows the pattern "course-chapter-id"
  const getBaseCourseId = (fullCourseId) => {
    const strId = String(fullCourseId);
    // If it follows pattern like "CSE-chapter-101", extract "CSE"
    const match = strId.match(/^([A-Za-z]+)(?:-chapter-\d+)?/);
    return match ? match[1] : strId;
  };

  // Find or create course progress - ensure consistent string comparison
  let courseProgress = user.courseProgress.find((progress) => {
    const progressCourseId = String(progress.courseId);
    const requestCourseId = String(courseId);

    // Try exact match first
    if (progressCourseId.toLowerCase().trim() === requestCourseId.toLowerCase().trim()) {
      return true;
    }

    // If exact match fails, try base course ID match (for cases like "CSE" vs "CSE-chapter-101")
    const baseProgressCourseId = getBaseCourseId(progressCourseId);
    const baseRequestCourseId = getBaseCourseId(requestCourseId);

    return baseProgressCourseId.toLowerCase().trim() === baseRequestCourseId.toLowerCase().trim();
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

  console.log(`[SaveExamResult] Saving exam attempt - courseId: "${courseId}", attemptNumber: ${attemptNumber}, score: ${percentageScore}%`);

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
  console.log(`[SaveExamResult] ExamAttempt saved with ID: ${examAttempt._id}`);

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

  // Extract base course ID if it follows the pattern "course-chapter-id"
  const getBaseCourseIdForExam = (fullCourseId) => {
    const strId = String(fullCourseId);
    // If it follows pattern like "CSE-chapter-101", extract "CSE"
    const match = strId.match(/^([A-Za-z]+)(?:-chapter-\d+)?/);
    return match ? match[1] : strId;
  };

  // Map of total topics per course category from courseCatalog.js
  const topicCounts = {
    "CSE": 7,
    "ECE": 4,
    "Mechanical": 4,
    "Civil": 4,
    "EEE": 4,
    "Diploma": 2
  };

  // Recalculate completion percentage based on videos completed and exam passed
  // Exclude exam videos from video completion calculation to avoid double counting
  const nonExamVideos = courseProgress.videos.filter(v => !v.videoId.startsWith('exam_'));
  const completedNonExamVideos = nonExamVideos.filter(v => v.isCompleted).length;

  // Use base course ID to get expected total videos
  const baseCourseId = getBaseCourseIdForExam(courseId);  // Use the local function
  const totalExpectedVideos = topicCounts[baseCourseId] || Math.max(nonExamVideos.length, 4);

  // New calculation: Treat videos and exam as items to be completed
  const totalItems = totalExpectedVideos + 1; // Videos + 1 Exam
  const completedItems = completedNonExamVideos + (passed ? 1 : 0);
  
  courseProgress.completionPercentage = Math.min(
    100,
    Math.round((completedItems / totalItems) * 100)
  );

  // If exam is passed, also mark the exam video as completed for this course
  const examVideoId = `exam_${courseId}`;
  let examVideoProgress = courseProgress.videos.find((v) => v.videoId === examVideoId);
  if (!examVideoProgress) {
    examVideoProgress = {
      videoId: examVideoId,
      isCompleted: passed,
      lastWatched: new Date(),
    };
    courseProgress.videos.push(examVideoProgress);
  } else {
    examVideoProgress.isCompleted = passed;
    examVideoProgress.lastWatched = new Date();
  }

  // Mark as modified and save
  user.markModified('courseProgress');
  await user.save();
  console.log(`[SaveExamResult] Successfully saved exam result for ${userId}, completion: ${courseProgress.completionPercentage}%`);

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

// NEW: Get exam history for a specific course
export const getExamHistory = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user?.userid || req.query.userId; // Support both auth and query param

  console.log(`[getExamHistory] Request for courseId: ${courseId}, userId: ${userId}`);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User authentication required"
    });
  }

  try {
    // Find all exam attempts for this user and course
    const examAttempts = await ExamAttempt.find({
      userId: userId,
      courseId: String(courseId)
    })
      .sort({ attemptDate: -1 })
      .lean();

    // Format the attempts for frontend
    const formattedAttempts = examAttempts.map((attempt, index) => ({
      attemptNumber: attempt.attemptNumber || (examAttempts.length - index),
      score: attempt.score,
      passed: attempt.passed,
      timestamp: attempt.attemptDate || attempt.createdAt,
      totalQuestions: attempt.totalQuestions,
      correctAnswers: attempt.correctAnswers,
      answers: attempt.answers || []
    }));

    res.status(200).json({
      success: true,
      attempts: formattedAttempts,
      totalAttempts: formattedAttempts.length
    });
  } catch (error) {
    console.error('[getExamHistory] Error fetching exam history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exam history',
      error: error.message
    });
  }
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

  // Find user by userid field to get access to their course progress for completion stats
  const user = await User.findOne({ userid: userId }).lean();
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User not found" });
  }

  // FIRST: Get all exam attempts from the single source of truth, the ExamAttempt collection.
  const allUserExamAttempts = await ExamAttempt.find({ userId: userId }).lean();
  console.log(`[getExamResults] Found ${allUserExamAttempts.length} total ExamAttempt records for user ${userId}`);

  if (allUserExamAttempts.length === 0) {
    // If there are no attempts, return an empty array.
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  // Group attempts by courseId
  const attemptsByCourse = new Map();
  allUserExamAttempts.forEach((attempt) => {
    const courseId = String(attempt.courseId);
    if (!attemptsByCourse.has(courseId)) {
      attemptsByCourse.set(courseId, []);
    }
    attemptsByCourse.get(courseId).push(attempt);
  });

  const examResults = [];

  // Iterate over each course that has attempts and build the result object
  for (const [courseId, attempts] of attemptsByCourse.entries()) {
    // Sort attempts by attempt number to process them chronologically
    const sortedAttempts = attempts.sort((a, b) => (a.attemptNumber || 0) - (b.attemptNumber || 0));

    // Get the latest attempt to represent the overall course result
    const latestAttempt = sortedAttempts.length > 0 ? sortedAttempts[sortedAttempts.length - 1] : null;

    // Find the corresponding course progress for this courseId to get completion percentage
    const courseProgress = user.courseProgress?.find(
      (p) => String(p.courseId) === courseId
    );

    // Try to find a descriptive course name from user's other data
    const selectedCourse = user.selectedCourses?.find(
      (c) => String(c.courseId) === courseId
    );
    let courseName = selectedCourse?.courseName || courseId;

    // Fallback to find course name from exam questions if needed
    if (courseName === courseId) {
      const query = { $or: [{ category: courseId }] };
      const chapterId = parseInt(courseId);
      if (!isNaN(chapterId)) {
        query.$or.push({ chapterId: chapterId });
      }

      const examInfo = await ExamQuestion.findOne(query).select('chapterName category course');
      if (examInfo) {
        courseName = examInfo.chapterName || examInfo.category || examInfo.course;
      }
    }

    // Format attempts for the frontend
    const enrichedExamAttempts = sortedAttempts.map((attempt) => ({
      ...attempt,
      attemptDate: attempt.attemptDate || attempt.createdAt,
      answers: (attempt.answers || []).map((answer) => ({
        ...answer,
        question: answer.question || `Question ${answer.questionIndex + 1}`,
        options: answer.options || [],
      })),
    }));

    examResults.push({
      courseId: courseId,
      courseName: courseName,
      score: latestAttempt ? latestAttempt.score : 0,
      passed: latestAttempt ? latestAttempt.passed : false,
      attempts: enrichedExamAttempts.length,
      lastAttempt: latestAttempt ? latestAttempt.attemptDate : null,
      completionPercentage: courseProgress?.completionPercentage || 0,
      answers: latestAttempt ? latestAttempt.answers : [],
      examAttempts: enrichedExamAttempts,
    });
  }

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
          message: `Question ${i + 1
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

// Get exam questions by category, course, and video
export const getExamQuestions = async (req, res) => {
  try {
    const { category, course, video, chapterId, numQuestions, attemptId } = req.query;
    const { courseId } = req.params;

    // Support both old format (category, course, video) and new format (chapterId, category)
    // Also support courseId parameter from route
    let queryCategory = category || courseId;
    let queryChapterId = chapterId ? parseInt(chapterId) : null;

    // Validate required parameters
    if (!queryCategory) {
      return res.status(400).json({
        success: false,
        message: "category or courseId is required",
      });
    }

    // If chapterId is provided, use it; otherwise require course and video (if not using courseId route)
    if (!queryChapterId && !courseId && (!course || !video)) {
      return res.status(400).json({
        success: false,
        message: "Either chapterId or (course and video) or courseId are required",
      });
    }

    let examData;

    if (queryChapterId) {
      // Search by chapterId and category
      examData = await ExamQuestion.findOne({
        chapterId: queryChapterId,
        category: queryCategory,
      });
    } else if (courseId) {
      // Search by courseId (treat it as category)
      examData = await ExamQuestion.findOne({
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
        } else if (courseId) {
          examData = await ExamQuestion.findOne({
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