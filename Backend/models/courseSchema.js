import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  unitId: {
    type: String,
    required: true
  },
  unitName: {
    type: String,
    required: true
  },
  chapters: [{
    chapterId: {
      type: String,
      required: true
    },
    chapterName: {
      type: String,
      required: true
    },
    topics: [{
      topicId: {
        type: String,
        required: true
      },
      topicName: {
        type: String,
        required: true
      },
      hasExam: {
        type: Boolean,
        default: true
      }
    }]
  }]
});

const subjectSchema = new mongoose.Schema({
  subjectId: {
    type: String,
    required: true
  },
  subjectName: {
    type: String,
    required: true
  },
  units: [unitSchema]
});

const semesterSchema = new mongoose.Schema({
  semesterId: {
    type: String,
    required: true
  },
  semesterName: {
    type: String,
    required: true
  },
  subjects: [subjectSchema]
});

const yearSchema = new mongoose.Schema({
  yearId: {
    type: String,
    required: true
  },
  yearName: {
    type: String,
    required: true
  },
  semesters: [semesterSchema]
});

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true
  },
  courseName: {
    type: String,
    required: true
  },
  branches: [{
    branchId: {
      type: String,
      required: true
    },
    branchName: {
      type: String,
      required: true
    },
    years: [yearSchema]
  }]
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
