import Course from "../models/courseSchema.js";
import User from "../models/userSchema.js";
import asyncHandler from "express-async-handler";

// Create a new course
export const createCourse = asyncHandler(async (req, res) => {
  const {
    courseName,
    courseDescription,
    courseDuration,
    courseCategory,
    thumbnail,
    videos = [],
    exam = null,
  } = req.body;

  // Validate required fields
  if (!courseName || !courseDescription || !courseDuration || !courseCategory || !thumbnail) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: courseName, courseDescription, courseDuration, courseCategory, and thumbnail are required'
    });
  }

  const course = await Course.create({
    courseName,
    courseDescription,
    courseDuration,
    courseCategory,
    thumbnail,
    videos: videos || [],
    exam: exam || {
      questions: [],
      passingScore: 70,
      timeLimit: 30
    }
  });

  res.status(201).json({
    success: true,
    data: course
  });
});

// Get all courses
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// Get single course by ID
export const getCourseById = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId || req.params.id;
  const course = await Course.findById(courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found'
    });
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// Record a user's course selection (stores userId + course info in DB)
export const selectCourse = asyncHandler(async (req, res) => {
  const { userId, courseId, courseName } = req.body;

  if (!userId || (!courseId && !courseName)) {
    return res.status(400).json({
      success: false,
      error: 'userId and courseId or courseName are required'
    });
  }

  // Find the user by the custom userid field
  const user = await User.findOne({ userid: userId });
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  const selectionId = courseId || courseName;
  const selectionName = courseName || courseId;

  // Initialize selectedCourses if missing
  if (!Array.isArray(user.selectedCourses)) {
    user.selectedCourses = [];
  }

  // Avoid duplicates; update timestamp if already selected
  const existing = user.selectedCourses.find(
    (c) => c.courseId === selectionId
  );

  if (existing) {
    existing.courseName = selectionName;
    existing.selectedAt = new Date();
  } else {
    user.selectedCourses.push({
      courseId: selectionId,
      courseName: selectionName,
      selectedAt: new Date()
    });
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user.selectedCourses,
    message: 'Course selection saved'
  });
});
