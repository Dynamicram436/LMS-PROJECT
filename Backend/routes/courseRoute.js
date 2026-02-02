import express from "express";
import Course from "../models/courseSchema.js";
import CourseStructure from "../models/courseStructureSchema.js";
import { seedCourseData } from "../controllers/courseController.js";

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message
    });
  }
});

// Get branches for a specific course
router.get("/:courseId/branches", async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ courseId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      data: course.branches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching branches",
      error: error.message
    });
  }
});

// Get years for a specific branch
router.get("/:courseId/branches/:branchId/years", async (req, res) => {
  try {
    const { courseId, branchId } = req.params;
    const course = await Course.findOne({ courseId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const branch = course.branches.find(b => b.branchId === branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found"
      });
    }

    res.status(200).json({
      success: true,
      data: branch.years
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching years",
      error: error.message
    });
  }
});

// Get semesters for a specific year
router.get("/:courseId/branches/:branchId/years/:yearId/semesters", async (req, res) => {
  try {
    const { courseId, branchId, yearId } = req.params;
    const course = await Course.findOne({ courseId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const branch = course.branches.find(b => b.branchId === branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found"
      });
    }

    const year = branch.years.find(y => y.yearId === yearId);
    if (!year) {
      return res.status(404).json({
        success: false,
        message: "Year not found"
      });
    }

    res.status(200).json({
      success: true,
      data: year.semesters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching semesters",
      error: error.message
    });
  }
});

// Get subjects for a specific semester
router.get("/:courseId/branches/:branchId/years/:yearId/semesters/:semesterId/subjects", async (req, res) => {
  try {
    const { courseId, branchId, yearId, semesterId } = req.params;
    const course = await Course.findOne({ courseId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const branch = course.branches.find(b => b.branchId === branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found"
      });
    }

    const year = branch.years.find(y => y.yearId === yearId);
    if (!year) {
      return res.status(404).json({
        success: false,
        message: "Year not found"
      });
    }

    const semester = year.semesters.find(s => s.semesterId === semesterId);
    if (!semester) {
      return res.status(404).json({
        success: false,
        message: "Semester not found"
      });
    }

    res.status(200).json({
      success: true,
      data: semester.subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching subjects",
      error: error.message
    });
  }
});

// Get units for a specific subject
router.get("/:courseId/branches/:branchId/years/:yearId/semesters/:semesterId/subjects/:subjectId/units", async (req, res) => {
  try {
    const { courseId, branchId, yearId, semesterId, subjectId } = req.params;
    const course = await Course.findOne({ courseId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const branch = course.branches.find(b => b.branchId === branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found"
      });
    }

    const year = branch.years.find(y => y.yearId === yearId);
    if (!year) {
      return res.status(404).json({
        success: false,
        message: "Year not found"
      });
    }

    const semester = year.semesters.find(s => s.semesterId === semesterId);
    if (!semester) {
      return res.status(404).json({
        success: false,
        message: "Semester not found"
      });
    }

    const subject = semester.subjects.find(s => s.subjectId === subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.status(200).json({
      success: true,
      data: subject.units
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching units",
      error: error.message
    });
  }
});

// Get chapters for a specific unit
router.get("/:courseId/branches/:branchId/years/:yearId/semesters/:semesterId/subjects/:subjectId/units/:unitId/chapters", async (req, res) => {
  try {
    const { courseId, branchId, yearId, semesterId, subjectId, unitId } = req.params;
    const course = await Course.findOne({ courseId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const branch = course.branches.find(b => b.branchId === branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found"
      });
    }

    const year = branch.years.find(y => y.yearId === yearId);
    if (!year) {
      return res.status(404).json({
        success: false,
        message: "Year not found"
      });
    }

    const semester = year.semesters.find(s => s.semesterId === semesterId);
    if (!semester) {
      return res.status(404).json({
        success: false,
        message: "Semester not found"
      });
    }

    const subject = semester.subjects.find(s => s.subjectId === subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const unit = subject.units.find(u => u.unitId === unitId);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found"
      });
    }

    res.status(200).json({
      success: true,
      data: unit.chapters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching chapters",
      error: error.message
    });
  }
});

// Get topics for a specific chapter
router.get("/:courseId/branches/:branchId/years/:yearId/semesters/:semesterId/subjects/:subjectId/units/:unitId/chapters/:chapterId/topics", async (req, res) => {
  try {
    const { courseId, branchId, yearId, semesterId, subjectId, unitId, chapterId } = req.params;
    const course = await Course.findOne({ courseId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const branch = course.branches.find(b => b.branchId === branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found"
      });
    }

    const year = branch.years.find(y => y.yearId === yearId);
    if (!year) {
      return res.status(404).json({
        success: false,
        message: "Year not found"
      });
    }

    const semester = year.semesters.find(s => s.semesterId === semesterId);
    if (!semester) {
      return res.status(404).json({
        success: false,
        message: "Semester not found"
      });
    }

    const subject = semester.subjects.find(s => s.subjectId === subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const unit = subject.units.find(u => u.unitId === unitId);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found"
      });
    }

    const chapter = unit.chapters.find(c => c.chapterId === chapterId);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found"
      });
    }

    res.status(200).json({
      success: true,
      data: chapter.topics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching topics",
      error: error.message
    });
  }
});

// Seed course data
router.post("/seed", seedCourseData);

export default router;
