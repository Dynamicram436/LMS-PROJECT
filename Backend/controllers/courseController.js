import Course from "../models/courseSchema.js";
import seedCourses from "../seedCourses.js";

export const seedCourseData = async (req, res) => {
  try {
    const result = await seedCourses();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error("Error seeding courses:", error);
    res.status(500).json({
      success: false,
      message: "Server error seeding courses",
      error: error.message
    });
  }
};
