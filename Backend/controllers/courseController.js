import Course from "../models/courseSchema.js";
import User from "../models/userSchema.js";

// Create a new course
export const createCourse = async (req, res) => {
  const {
    courseName,
    courseDescription,
    courseDuration,
    courseCategory,
    thumbnail,
    videos = [],
    exam = null,
  } = req.body;

  try {
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
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// Get single course by ID
export const getCourseById = async (req, res) => {
  try {
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
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid course ID'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// Record a user's course selection (stores userId + course info in DB)
export const selectCourse = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};
